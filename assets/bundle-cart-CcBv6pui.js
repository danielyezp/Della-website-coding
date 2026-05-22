import { D as Delegate } from "./main-BCFY9a9_.js";
import {
  n as qs,
  r as emit,
  f as toggleClass,
  e as on,
  t as qsa,
  u as addClass,
  d as subscribe,
} from "./evx.es-DeZd_zDv.js";
import { c as cart, d as dispatchCustomEvent } from "./cart-DuZn5teP.js";
import {
  i as isSlideOpen,
  s as prepareSlide,
  a as closeSlide,
  b as openSlide,
} from "./slide-anim.module-BD6L1fKk.js";
import { C as Carousel } from "./carousel-BtDnmkQW.js";

const selectors = {
  item: "[data-input-item]",
  itemProperties: "[data-item-properties]",
  quantityInput: "[data-quantity-input]",
  quantityAdd: "[data-add-quantity]",
  quantitySubtract: "[data-subtract-quantity]",
  removeItem: "[data-remove-item]",
};

const cartRoutes = window.theme.routes.cart || {};
const cartUpdateUrl = `${cartRoutes.update || "/cart/update"}.js`;

const useCustomEvents = window.flu?.states?.useCustomEvents;

async function updateCartItems(updates) {
  const response = await fetch(cartUpdateUrl, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ updates }),
  });

  if (!response.ok) {
    throw new Error(`Cart update failed with status ${response.status}`);
  }

  return response.json();
}

function broadcastCartUpdate(updatedCart) {
  emit("cart:updated", { cart: updatedCart });
  emit("quick-cart:updated");
  if (useCustomEvents) {
    dispatchCustomEvent("cart:updated", { cart: updatedCart });
  }
}

function initQuantityButtons(container) {
  const delegate = new Delegate(container);

  delegate.on("click", selectors.quantitySubtract, (_event, target) => {
    const item = target.closest(selectors.item);
    const { key, bundleId, bundleRole } = item.dataset;
    const newQty = parseInt(qs(selectors.quantityInput, item).value, 10) - 1;

    if (newQty <= 0 && bundleId && bundleRole === "main") {
      emit("quantity-update:remove", null, { key, bundleId, bundleRole });
      return;
    }

    if (bundleId && bundleRole === "main") {
      emit("quantity-update:adjust", null, { key, bundleId, newQty });
      return;
    }

    emit("quantity-update:subtract", null, { key });
    cart.updateItem(key, newQty);
  });

  delegate.on("click", selectors.quantityAdd, (_event, target) => {
    const item = target.closest(selectors.item);
    const { key, bundleId, bundleRole } = item.dataset;
    const newQty = parseInt(qs(selectors.quantityInput, item).value, 10) + 1;

    if (bundleId && bundleRole === "main") {
      emit("quantity-update:adjust", null, { key, bundleId, newQty });
      return;
    }

    emit("quantity-update:add", null, { key });
    cart.updateItem(key, newQty);
  });

  delegate.on("click", selectors.removeItem, (_event, target) => {
    const item = target.closest(selectors.item);
    const { key, bundleId, bundleRole } = item.dataset;

    emit("quantity-update:remove", null, { key, bundleId, bundleRole });

    if (bundleRole !== "main") {
      cart.updateItem(key, 0);
    }
  });

  return {
    unload: () => {
      delegate.off();
    },
  };
}

const { strings: { cart: cartStrings } } = window.theme;
const noteSelectors = {
  cartNoteTrigger: "[data-order-note-trigger]",
  cartNoteTriggerText: "[data-cart-not-trigger-text]",
  cartNoteInputWrapper: "[cart-note-input]",
  iconPlus: ".icon-plus-small",
  iconMinus: ".icon-minus-small",
};

function initCartNote(container) {
  const delegate = new Delegate(container);
  delegate.on("click", noteSelectors.cartNoteTrigger, (_event, target) => toggleNote(target));

  function toggleNote(trigger) {
    const inputWrapper = qs(noteSelectors.cartNoteInputWrapper, trigger.parentNode);
    const textarea = qs("textarea", inputWrapper);
    const plusIcon = qs(noteSelectors.iconPlus, trigger);
    const minusIcon = qs(noteSelectors.iconMinus, trigger);

    toggleClass([plusIcon, minusIcon], "hidden");

    if (isSlideOpen(inputWrapper)) {
      prepareSlide(inputWrapper);
      closeSlide(inputWrapper);
      inputWrapper.setAttribute("aria-expanded", false);
      inputWrapper.setAttribute("aria-hidden", true);

      const noteTriggerText = qs(noteSelectors.cartNoteTriggerText, container);
      noteTriggerText.innerText = textarea.value === "" ? cartStrings.addCartNote : cartStrings.editCartNote;
    } else {
      prepareSlide(inputWrapper);
      openSlide(inputWrapper);
      inputWrapper.setAttribute("aria-expanded", true);
      inputWrapper.setAttribute("aria-hidden", false);
    }
  }

  return {
    unload: () => {
      delegate.off();
    },
  };
}

const crossSellSelectors = {
  crossSellsSlider: "[data-cross-sells-slider]",
  quickViewTrigger: "[data-quick-view-trigger]",
  addToCartTrigger: "[data-add-item-id]",
};

function initCrossSells(container) {
  const { crossSellsSlider } = qs(crossSellSelectors.crossSellsSlider, container).dataset;
  const slider = crossSellsSlider ? new Carousel(container, { slidesPerView: 1.15, spaceBetween: 8 }) : null;

  const listeners = [
    on(qsa(crossSellSelectors.quickViewTrigger, container), "click", (event) => {
      const { productUrl } = event.target.dataset;
      if (productUrl) {
        emit("quick-view:open", null, { productUrl });
      }
    }),
    on(qsa(crossSellSelectors.addToCartTrigger, container), "click", (event) => {
      const { addItemId } = event.target.dataset;
      if (addItemId) {
        addClass(event.target, "loading");
        cart.addItemById(addItemId, 1);
        emit("quick-cart:scrollup");
      }
    }),
  ];

  return {
    unload: () => {
      listeners.forEach((listener) => listener());
      slider?.destroy();
    },
  };
}

function initBundleCart() {
  const removeListener = subscribe("quantity-update:remove", async (_event, { bundleId, bundleRole }) => {
    if (!bundleId || bundleRole !== "main") return;

    let currentCart;
    try {
      currentCart = await cart.get();
    } catch (error) {
      console.error("[BundleCart] failed to fetch cart:", error);
      return;
    }

    const bundleItems = currentCart.items.filter((item) => (item.properties || {}).bundle_id === bundleId);
    if (!bundleItems.length) return;

    const updates = {};
    bundleItems.forEach((item) => {
      updates[item.key] = 0;
    });

    try {
      const updatedCart = await updateCartItems(updates);
      broadcastCartUpdate(updatedCart);
    } catch (error) {
      console.error("[BundleCart] error removing bundle items:", error);
      cart.get().then((freshCart) => emit("cart:updated", { cart: freshCart }));
    }
  });

  const adjustListener = subscribe("quantity-update:adjust", async (_event, { bundleId, key, newQty }) => {
    if (!bundleId) return;

    let currentCart;
    try {
      currentCart = await cart.get();
    } catch (error) {
      console.error("[BundleCart] failed to fetch cart:", error);
      return;
    }

    const mainItem = currentCart.items.find((item) => item.key === key);
    if (!mainItem) return;

    const oldQty = mainItem.quantity;
    const bundleItems = currentCart.items.filter((item) => (item.properties || {}).bundle_id === bundleId);
    if (!bundleItems.length) return;

    const updates = {};
    bundleItems.forEach((item) => {
      updates[item.key] = item.key === key ? newQty : Math.round((item.quantity / oldQty) * newQty);
    });

    try {
      const updatedCart = await updateCartItems(updates);
      broadcastCartUpdate(updatedCart);
    } catch (error) {
      console.error("[BundleCart] error adjusting bundle quantities:", error);
      cart.get().then((freshCart) => emit("cart:updated", { cart: freshCart }));
    }
  });

  return {
    destroy() {
      removeListener();
      adjustListener();
    },
  };
}

export {
  initBundleCart as B,
  initCartNote as C,
  initQuantityButtons as Q,
  initCrossSells as a,
};
