import { D as Delegate } from "./main-BCFY9a9_.js";
import {
  u as addClass,
  b as removeClass,
  a as registerSection,
  n as query,
  d as listen,
  e as listenDom,
} from "./evx.es-DeZd_zDv.js";
import { c as createFocusTrap } from "./focus-trap.esm-D2ssBw0w.js";
import { l as lockScroll, u as unlockScroll } from "./tua-bsl-CUNYusb_.js";
import { c as cart, d as dispatchCustomEvent } from "./cart-DuZn5teP.js";
import { m as request } from "./xhr-DPgtqhaK.js";
import {
  Q as initQuantityButtons,
  B as initBundleCart,
  C as initCartNote,
  a as initCrossSells,
} from "./bundle-cart-422a0b7b.js";
import { u as updateInnerHTML } from "./update-inner-html-9s56gxNs.js";
import { f as initFreeShippingBar } from "./free-shipping-bar-DXLn-ey1.js";
import { d as delayOffset } from "./delay-offset-G3BUmTZ-.js";
import { s as shouldAnimate } from "./shouldAnimate-DkS0yM7E.js";
import "./storage-CVUx8WVm.js";
import "./slide-anim.module-BD6L1fKk.js";
import "./carousel-BtDnmkQW.js";
import "./formatMoney-CYQmZU7x.js";

const animationSelectors = {
  animationItem: ".animation--quick-cart-items > *, .animation--quick-cart-footer",
};

const animationClasses = {
  animationRevealed: "animation--quick-cart-revealed",
};

const animateQuickCart = (container) => {
  setup();

  function open() {
    addClass(container, animationClasses.animationRevealed);
  }

  function close() {
    removeClass(container, animationClasses.animationRevealed);
  }

  function setup() {
    delayOffset(container, [animationSelectors.animationItem]);
  }

  return { open, close, setup };
};

const selectors = {
  cartWrapper: ".quick-cart__wrapper",
  innerContainer: ".quick-cart__container",
  overlay: ".quick-cart__overlay",
  closeButton: ".quick-cart__close-icon",
  footer: ".quick-cart__footer",
  items: ".quick-cart__items",
  cartError: ".quick-cart__item-error",
  form: ".quick-cart__form",
  cartCount: ".quick-cart__heading sup",
  subtotal: ".quick-cart__footer-subtotal span",
  quantityInput: ".quick-cart .quantity-input__input",
  quantityItem: "[data-input-item]",
  discounts: ".quick-cart__item-discounts",
  freeShippingBar: "[data-free-shipping-bar]",
  crossSells: "[data-cross-sells]",
  clearCart: "[data-clear-cart]",
};

const classes = {
  active: "active",
  hidden: "hidden",
  updatingQuantity: "has-quantity-update",
  removed: "is-removed",
};

let fluorescentStates;
const useCustomEvents =
  (fluorescentStates = window.flu.states) == null
    ? void 0
    : fluorescentStates.useCustomEvents;

registerSection("quick-cart", {
  onLoad() {
    this.cartWrapper = query(selectors.cartWrapper, this.container);
    this.cartTrap = createFocusTrap(this.container, { allowOutsideClick: true });
    this.isRefreshingQuickCart = false;
    this.openAfterRefresh = false;

    this.events = [
      listen("quick-cart:open", () => this.openQuickCart()),
      listen("quick-cart:updated", () => this.refreshQuickCart()),
      listen("cart:updated", (event) =>
        this.updateClearCartVisibility(event == null ? void 0 : event.cart),
      ),
      listen("quick-cart:error", (event, { key, errorMessage }) => {
        this.handleErrorMessage(key, errorMessage);
      }),
      listen("quick-cart:scrollup", () => this.scrollUpQuickCart()),
      listen(
        ["quantity-update:subtract", "quantity-update:add", "quantity-update:adjust"],
        (event, { key }) => {
          this.handleQuantityUpdate(key);
        },
      ),
      listen("quantity-update:remove", (event, { key }) => {
        this.handleItemRemoval(key);
      }),
      listenDom(document, "apps:product-added-to-cart", () => {
        this.refreshQuickCart();
      }),
    ];

    this.quantityButtons = initQuantityButtons(this.container);
    this.bundleCart = initBundleCart();
    this.cartNoteToggle = initCartNote(this.container);
    cart.get().then((cartState) => this.updateClearCartVisibility(cartState));

    if (shouldAnimate(this.container)) {
      this.animateQuickCart = animateQuickCart(this.container);
    }

    this.delegate = new Delegate(this.container);
    this.delegate.on("click", selectors.overlay, () => this.close());
    this.delegate.on("click", selectors.closeButton, () => this.close());
    this.delegate.on("change", selectors.quantityInput, (event) =>
      this.handleQuantityInputChange(event),
    );
    this.delegate.on("click", selectors.clearCart, () => this.handleClearCart());

    const freeShippingBar = query(selectors.freeShippingBar, this.container);
    if (freeShippingBar) initFreeShippingBar(freeShippingBar);
    this._initCrossSells();
  },

  getScrollLockTarget() {
    return query(selectors.form, this.container) || this.container;
  },

  openQuickCart() {
    if (this.isRefreshingQuickCart) {
      this.openAfterRefresh = true;
      return;
    }

    addClass(this.cartWrapper, classes.active);
    this.cartTrap.activate();
    if (this.animateQuickCart) this.animateQuickCart.open();
    document.body.setAttribute("data-fluorescent-overlay-open", "true");
    this.scrollLockTarget = this.getScrollLockTarget();
    lockScroll(this.scrollLockTarget);

    cart.get().then((cartState) => {
      this.updateClearCartVisibility(cartState);
      if (useCustomEvents) {
        dispatchCustomEvent("quick-cart:open", { cart: cartState });
      }
    });
  },

  refreshQuickCart() {
    const url = `${theme.routes.cart.base}?section_id=${this.id}`;
    this.isRefreshingQuickCart = true;

    request("GET", url)
      .then((response) => {
        const incoming = document.createElement("div");
        incoming.innerHTML = response;
        const incomingInner = query(selectors.innerContainer, incoming);
        const hasCurrentItems = !!query(selectors.items, this.container);
        const hasIncomingItems = !!query(selectors.items, incoming);
        const incomingFreeShippingBar = query(selectors.freeShippingBar, incoming);

        if (this.crossSells) this.crossSells.unload();
        if (incomingFreeShippingBar) initFreeShippingBar(incomingFreeShippingBar);

        if (hasIncomingItems && hasCurrentItems) {
          updateInnerHTML(`${selectors.cartWrapper} ${selectors.items}`, incoming);
          updateInnerHTML(`${selectors.cartWrapper} ${selectors.cartCount}`, incoming);
          updateInnerHTML(`${selectors.cartWrapper} ${selectors.subtotal}`, incoming);
          updateInnerHTML(`${selectors.cartWrapper} ${selectors.discounts}`, incoming);

          const form = query(selectors.form, this.container);
          if (form) {
            const scrollTop = form.scrollTop || 0;
            form.scrollTop = scrollTop;
          }

          if (this.animateQuickCart) this.animateQuickCart.setup();
        } else if (incomingInner) {
          const currentInner = query(selectors.innerContainer, this.container);
          if (currentInner) currentInner.innerHTML = incomingInner.innerHTML;
        }

        this._initCrossSells();
      })
      .catch((error) => {
        console.error("[QuickCart] refresh failed:", error);
      })
      .finally(() => {
        this.isRefreshingQuickCart = false;
        document.dispatchEvent(new CustomEvent("quick-cart:refreshed"));

        if (this.openAfterRefresh) {
          this.openAfterRefresh = false;
          this.openQuickCart();
        }
      });
  },

  handleErrorMessage(key) {
    const item = query(`[data-key="${key}"]`, this.container);
    if (!item) return;
    removeClass(query(selectors.cartError, item), classes.hidden);
    removeClass(item, classes.updatingQuantity);
  },

  handleQuantityUpdate(key) {
    const item = query(`[data-key="${key}"]`, this.container);
    if (item) addClass(item, classes.updatingQuantity);
  },

  handleItemRemoval(key) {
    const item = query(`[data-key="${key}"]`, this.container);
    if (!item) return;
    addClass(item, classes.removed);
    addClass(item, classes.updatingQuantity);
  },

  updateClearCartVisibility(cartState) {
    const clearCart = query(selectors.clearCart, this.container);
    if (!clearCart || !(cartState != null && cartState.items)) return;

    const hasOrphanedChild = cartState.items.some((item) => {
      const properties = item.properties || {};
      if (!properties.bundle_id || properties.main_bundle === "true") return false;

      return !cartState.items.some((candidate) => {
        var _a, _b;
        return (
          ((_a = candidate.properties) == null ? void 0 : _a.bundle_id) ===
            properties.bundle_id &&
          ((_b = candidate.properties) == null ? void 0 : _b.main_bundle) === "true"
        );
      });
    });

    clearCart.classList.toggle(classes.hidden, !hasOrphanedChild);
  },

  handleClearCart() {
    const clearCart = query(selectors.clearCart, this.container);
    if (clearCart) {
      clearCart.setAttribute("disabled", "disabled");
      clearCart.setAttribute("aria-busy", "true");
    }

    cart
      .clearCart()
      .catch((error) => {
        console.error("[QuickCart] clear cart failed:", error);
      })
      .finally(() => {
        if (clearCart) {
          clearCart.removeAttribute("disabled");
          clearCart.removeAttribute("aria-busy");
        }
      });
  },

  handleQuantityInputChange({ target }) {
    const item = target.closest(selectors.quantityItem);
    const { key } = item.dataset;
    cart.updateItem(key, target.value);
    this.handleQuantityUpdate(key);
  },

  _initCrossSells() {
    const crossSells = query(selectors.crossSells, this.container);
    if (crossSells) this.crossSells = initCrossSells(crossSells);
  },

  scrollUpQuickCart() {
    const form = query(selectors.form, this.container);
    const scrollTop = 0;
    if (form) {
      setTimeout(() => {
        form.scrollTop = scrollTop;
      }, 300);
    }
  },

  close() {
    removeClass(this.cartWrapper, classes.active);
    setTimeout(() => {
      if (this.animateQuickCart) this.animateQuickCart.close();
      this.cartTrap.deactivate();
      document.body.setAttribute("data-fluorescent-overlay-open", "false");

      if (this.scrollLockTarget) {
        unlockScroll(this.scrollLockTarget);
        this.scrollLockTarget = null;
      }
    }, 500);

    if (useCustomEvents) dispatchCustomEvent("quick-cart:close");
  },

  onSelect() {
    this.openQuickCart();
  },

  onDeselect() {
    this.close();
  },

  onUnload() {
    if (this.scrollLockTarget) {
      unlockScroll(this.scrollLockTarget);
      this.scrollLockTarget = null;
    }

    this.delegate.off();
    this.events.forEach((event) => event());
    this.quantityButtons.unload();
    this.bundleCart.destroy();
    this.cartNoteToggle.unload();
  },
});
