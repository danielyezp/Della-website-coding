import { P as Product } from "./product-DVa0L_qh.js";
import {
  s as slideStop,
  b as slideDown,
  a as slideUp,
} from "./slide-anim.module-BD6L1fKk.js";
import {
  t as queryAll,
  e as listen,
  n as query,
  r as emit,
  a as registerSection,
} from "./evx.es-DeZd_zDv.js";
import { a as animateProduct } from "./product-DLfhPYYT.js";
import { f as formatMoney } from "./formatMoney-CYQmZU7x.js";
import { c as cart, d as dispatchCustomEvent } from "./cart-DuZn5teP.js";
import { i as initEcoRebateBadge } from "./product-item-CXoEordi.js";
import "./media-queries-CokWIw5y.js";
import "./at-breakpoint-change-DVsQWIFj.js";
import "./social-share-erGsLdBW.js";
import "./accordions-BA01Lx1e.js";
import "./information-popup-Byyyjkr4.js";
import "./carousel-BtDnmkQW.js";
import "./sticky-scroll-M7SDKYIC.js";
import "./provide-resize-observer-B9BJdOJd.js";
import "./recently-viewed-products-CUo44wPy.js";
import "./xhr-DPgtqhaK.js";
import "./wrapTables-BziL4gGw.js";
import "./core-PeziJRpu.js";
import "./intersection-watcher-8GvknGdC.js";
import "./delay-offset-G3BUmTZ-.js";
import "./storage-CVUx8WVm.js";

const selectors = {
  bundleZoneSelect: "[data-bundle-zone-select]",
  productForm: "[data-product-form]",
  addToCart: "[data-add-to-cart]",
  variantSelect: "[data-variant-select]",
  variantId: '[name="id"]',
  quantityInput: '[name="quantity"]',
  price: "[data-price]",
};

let fluorescentStates;
const useCustomEvents =
  (fluorescentStates = window.flu.states) == null
    ? void 0
    : fluorescentStates.useCustomEvents;

function updateHeaderCartCount(itemCount) {
  queryAll("[data-js-cart-count]", document).forEach((cartCount) => {
    cartCount.innerHTML = itemCount;
    cartCount.classList.toggle("hidden", itemCount === 0);
  });
}

function initBundleConfiguration(productSection, bundleConfiguration) {
  const sectionId = productSection.dataset.sectionId;
  console.log(`[BundleConfiguration] init - section: ${sectionId}`);

  const zoneSelects = queryAll(selectors.bundleZoneSelect, bundleConfiguration);
  console.log(`[BundleConfiguration] found ${zoneSelects.length} zone select(s)`);

  let basePrice = parseInt(bundleConfiguration.dataset.basePrice || "0", 10);
  console.log(`[BundleConfiguration] initial base price: ${basePrice}`);

  const variantsById = {};
  try {
    const productJson = document.getElementById(`ProductJson-${sectionId}`);
    if (productJson) {
      JSON.parse(productJson.textContent).variants.forEach((variant) => {
        variantsById[variant.id] = variant;
      });
      console.log(
        `[BundleConfiguration] parsed ${Object.keys(variantsById).length} variants from ProductJson`,
      );
    }
  } catch (error) {
    console.warn("[BundleConfiguration] could not parse ProductJson", error);
  }

  function selectedOptionsTotal() {
    return zoneSelects.reduce((total, select) => {
      const selectedOption = select.options[select.selectedIndex];
      const optionPrice = parseInt(
        (selectedOption == null ? void 0 : selectedOption.dataset.optionPrice) ||
          "0",
        10,
      );
      return total + optionPrice;
    }, 0);
  }

  function updateAtcPrice() {
    const optionsTotal = selectedOptionsTotal();
    const totalPrice = basePrice + optionsTotal;
    const formattedPrice = formatMoney(totalPrice);
    console.log(
      `[BundleConfiguration] updateAtcPrice -> ${formattedPrice} (base: ${basePrice} + zones: ${optionsTotal})`,
    );

    queryAll(selectors.price, productSection).forEach((price) => {
      price.innerHTML = formattedPrice;
    });
  }

  updateAtcPrice();

  const selectListeners = zoneSelects.map((select) => {
    console.log(
      `[BundleConfiguration] attaching change listener to select: "${select.dataset.label}"`,
    );
    return listen(select, "change", (event) => {
      const selectedOption = event.target.options[event.target.selectedIndex];
      console.log(
        `[BundleConfiguration] zone select changed - label: "${event.target.dataset.label}", varId: ${
          selectedOption == null ? void 0 : selectedOption.dataset.varId
        }, price: ${selectedOption == null ? void 0 : selectedOption.dataset.price}`,
      );
      updateAtcPrice();
    });
  });

  const variantSelect = query(selectors.variantSelect, productSection);
  const variantListener = variantSelect
    ? listen(variantSelect, "change", () => {
        const variantId = parseInt(variantSelect.value, 10);
        const variant = variantsById[variantId];
        if (variant) {
          basePrice = variant.price;
          console.log(
            `[BundleConfiguration] main variant changed to ${variantId}, new base price: ${basePrice}`,
          );
          setTimeout(updateAtcPrice, 0);
        }
      })
    : null;

  const productForm = query(selectors.productForm, productSection);
  console.log("[BundleConfiguration] product form found:", productForm);

  if (!productForm) {
    console.warn(
      "[BundleConfiguration] no [data-product-form] found - submit interception disabled",
    );
    return {
      destroy: () => {
        selectListeners.forEach((listener) => listener());
        if (variantListener) variantListener();
      },
    };
  }

  const handleFormSubmit = async (event) => {
    console.log("[BundleConfiguration] handleFormSubmit fired - intercepting submit");
    event.preventDefault();
    event.stopImmediatePropagation();

    const addToCartButtons = queryAll(selectors.addToCart, productSection);
    addToCartButtons.forEach((button) => {
      button.classList.add("loading");
      button.setAttribute("disabled", "disabled");
      button.setAttribute("aria-busy", "true");
    });

    const mainVariantId = query(selectors.variantId, productForm)?.value;
    const quantity = parseInt(
      query(selectors.quantityInput, productForm)?.value || "1",
      10,
    );
    const bundleId = `bundle_${Date.now()}_${Math.floor(Math.random() * 1e4)}`;

    console.log(
      `[BundleConfiguration] main variant ID: ${mainVariantId}, quantity: ${quantity}, bundle ID: ${bundleId}`,
    );

    const childItems = [];
    zoneSelects.forEach((select) => {
      const selectedOption = select.options[select.selectedIndex];
      const selectedVariantId = selectedOption?.dataset.varId || select.value;
      const optionLabel =
        select.dataset.label || select.getAttribute("aria-label") || "Option";

      console.log(
        `[BundleConfiguration] zone item - label: "${optionLabel}", variantId: ${selectedVariantId}, price: ${
          selectedOption == null ? void 0 : selectedOption.dataset.price
        }`,
      );

      if (selectedVariantId) {
        childItems.push({
          id: parseInt(selectedVariantId, 10),
          quantity,
          properties: {
            bundle_id: bundleId,
            "Option Label": optionLabel,
          },
        });
      }
    });

    const allItems = [
      ...childItems,
      ...(mainVariantId
        ? [
            {
              id: parseInt(mainVariantId, 10),
              quantity,
              properties: {
                bundle_id: bundleId,
                "Product Type": "Bundle",
                main_bundle: "true",
              },
            },
          ]
        : []),
    ];

    console.log(
      `[BundleConfiguration] allItems to add (${allItems.length} total):`,
      allItems,
    );

    if (allItems.length === 0) {
      console.warn("[BundleConfiguration] no items to add - aborting submit");
      addToCartButtons.forEach((button) => {
        button.classList.remove("loading");
        button.removeAttribute("disabled");
        button.removeAttribute("aria-busy");
      });
      return;
    }

    const cartAddUrl = `${(window.theme.routes.cart || {}).add || "/cart/add"}.js`;
    console.log(`[BundleConfiguration] POSTing to ${cartAddUrl}`);

    try {
      emit("cart:updating");
      console.log("[BundleConfiguration] emitted cart:updating");

      const addResponse = await fetch(cartAddUrl, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ items: allItems }),
      });
      console.log(
        `[BundleConfiguration] /cart/add.js response status: ${addResponse.status}`,
      );

      const addedProduct = await addResponse.json();
      console.log("[BundleConfiguration] /cart/add.js response body:", addedProduct);
      if (addedProduct.status === 422) throw new Error(addedProduct.description);

      const updatedCart = await cart.get();
      console.log(
        "[BundleConfiguration] cart.get() resolved, item count:",
        updatedCart.item_count,
      );

      updateHeaderCartCount(updatedCart.item_count);
      console.log("[BundleConfiguration] updated header cart count");

      emit("cart:updated", { cart: updatedCart });
      console.log("[BundleConfiguration] emitted cart:updated");

      emit("quick-cart:updated");
      console.log("[BundleConfiguration] emitted quick-cart:updated");

      setTimeout(() => {
        console.log("[BundleConfiguration] emitting quick-cart:open");
        emit("quick-cart:open");
      }, 300);

      if (useCustomEvents) {
        dispatchCustomEvent("cart:updated", { cart: updatedCart });
        dispatchCustomEvent("cart:item-added", { product: addedProduct });
        console.log(
          "[BundleConfiguration] dispatched custom events cart:updated + cart:item-added",
        );
      }
    } catch (error) {
      console.error("[BundleConfiguration] Add to cart error:", error);
    } finally {
      addToCartButtons.forEach((button) => {
        button.classList.remove("loading");
        button.removeAttribute("disabled");
        button.removeAttribute("aria-busy");
      });
      console.log("[BundleConfiguration] buttons re-enabled");
    }
  };

  productForm.addEventListener("submit", handleFormSubmit, { capture: true });
  console.log("[BundleConfiguration] submit listener attached to form");

  return {
    destroy() {
      console.log(`[BundleConfiguration] destroy - section: ${sectionId}`);
      selectListeners.forEach((listener) => listener());
      if (variantListener) variantListener();
      productForm.removeEventListener("submit", handleFormSubmit, { capture: true });
    },
  };
}

registerSection("product", {
  onLoad() {
    this.product = new Product(this.container);
    this.animateProduct = animateProduct(this.container);
    this.ecoRebateBadge = initEcoRebateBadge(this.container);

    const bundleConfiguration = query("[data-bundle-configuration]", this.container);
    if (bundleConfiguration) {
      this.bundleConfiguration = initBundleConfiguration(
        this.container,
        bundleConfiguration,
      );
    }
  },

  onBlockSelect({ target }) {
    const accordionLabel = query(".accordion__label", target);
    target.scrollIntoView({ block: "center", behavior: "smooth" });
    if (!accordionLabel) return;

    const { parentNode, nextElementSibling } = accordionLabel;
    slideStop(nextElementSibling);
    slideDown(nextElementSibling);
    parentNode.setAttribute("data-open", true);
    accordionLabel.setAttribute("aria-expanded", true);
    nextElementSibling.setAttribute("aria-hidden", false);
  },

  onBlockDeselect({ target }) {
    const accordionLabel = query(".accordion__label", target);
    if (!accordionLabel) return;

    const { parentNode, nextElementSibling } = accordionLabel;
    slideStop(nextElementSibling);
    slideUp(nextElementSibling);
    parentNode.setAttribute("data-open", false);
    accordionLabel.setAttribute("aria-expanded", false);
    nextElementSibling.setAttribute("aria-hidden", true);
  },

  onUnload() {
    this.product.unload();
    this.animateProduct?.destroy();
    this.bundleConfiguration?.destroy();
    this.ecoRebateBadge?.call(this);
  },
});
