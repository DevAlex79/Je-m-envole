import { defineStore } from "pinia";
import { reactive } from "vue";
import { Lines } from '../models/Lines';
import shipment from '../models/Shipment';

export const useCartStore = defineStore('cart', {
    state: () => ({
        lines: reactive(new Lines()),
        shipment: shipment
        /*shipment: reactive({
            type: 'relais',
            price: 5  // Initialisation par défaut, ou charger depuis le stockage local
        })*/
    }),
    actions: {
        addProductToCart(product) {
            console.log('Product to add:', product);
            //const existingLine = this.lines.lines.find(line => line.name === product.name);
            const existingLine = this.lines.lines.find(line => line.id === product.id);
            if (existingLine) {
                existingLine.quantity += 1;
                existingLine.total = existingLine.unitPrice * existingLine.quantity;
            } else {
                //product.quantity = product.quantity || 1;
                product.quantity = 1;
                product.unitPrice = product.unitPrice || 0;
                product.total = product.unitPrice * product.quantity;
                this.lines.addLine(product);
            }
            console.log('Cart after addition:', this.lines.lines);
            this.saveCartToLocalStorage();
        },
        removeProductFromCart(product) {
            this.lines.removeLine(product);
            console.log('Cart after removal:', this.lines.lines);
            this.saveCartToLocalStorage();
        },
        updateShipmentType(type) {
            this.shipment.type = type;
            this.shipment.price = this.calculateShipmentPrice(type); // Update shipment price
            this.saveCartToLocalStorage();
        },
        /*calculateShipmentPrice(type) {
            switch (type) {
                case 'relais':
                    return 5;
                case 'domicile':
                    return 12;
                default:
                    return 0;
            }
        },*/
        saveCartToLocalStorage() {
            localStorage.setItem('cart', JSON.stringify(this.lines.lines));
            //localStorage.setItem('shipment', JSON.stringify(this.shipment));
            localStorage.setItem('shipment', JSON.stringify({
                type: this.shipment.type,
                price: this.shipment.price
            }));
        },
        loadCartFromLocalStorage() {
            const cart = localStorage.getItem('cart');
            const shipmentData = localStorage.getItem('shipment');
            if (cart) {
                const parsedCart = JSON.parse(cart);
                parsedCart.forEach(item => {
                    const existingLine = this.lines.lines.find(line => line.id === item.id);
                    if (existingLine) {
                        existingLine.quantity = item.quantity;
                        existingLine.total = existingLine.unitPrice * existingLine.quantity;
                    } else {
                        this.lines.addLine(item);
                    }
                });
            }
            
            /*if (shipment) {
                try {
                    const parsedShipment = JSON.parse(shipment);
                    if (parsedShipment.type) {
                        this.shipment.type = parsedShipment.type;
                    }
                    if (parsedShipment.price) {
                        this.shipment.price = parsedShipment.price;
                    }
                } catch (error) {
                    console.error('Error parsing shipment from localStorage:', error);
                }
            }*/

            if (shipmentData) {
                try {
                    const parsedShipment = JSON.parse(shipmentData);
                    this.shipment.type = parsedShipment.type || 'relais';
                    this.shipment.price = parsedShipment.price || 5;
                } catch (error) {
                    console.error('Error parsing shipment from localStorage:', error);
                }
            }
        },
        initShipment() {
            this.loadCartFromLocalStorage();
        }
    },
    getters: {
        //totalArticles: state => state.lines.calculateTotalArticles(),
        /*totalArticles: state => {
            const total = state.lines.calculateTotalArticles();
            console.log('Total Articles:', total);
            return total;
        },
        totalArticlesPrice: state => state.lines.calculateTotalArticlesPrice(),
        shipmentPrice: state => state.shipment.price,
        totalPrice: state => {
            const total = state.lines.calculateTotalArticlesPrice() + state.shipment.price;
            console.log('Total Price:', total);
            return total;
        }*/
        totalArticles: state => state.lines.calculateTotalArticles(),
        totalArticlesPrice: state => state.lines.calculateTotalArticlesPrice(),
        shipmentPrice: state => state.shipment.price,
        totalPrice: state => state.lines.calculateTotalArticlesPrice() + state.shipment.price
    }
});





/*import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCartStore = defineStore('cart', () => {
    const lines = ref([]);
    const shipmentType = ref('relais'); // Par défaut à 'relais'

    const shipmentPrices = {
        relais: 5,
        domicile: 12,
    };

    const totalArticles = computed(() => {
        return lines.value.reduce((sum, line) => sum + line.quantity, 0);
    });

    const totalArticlesPrice = computed(() => {
        return lines.value.reduce((sum, line) => sum + line.price * line.quantity, 0);
    });

    const shipmentPrice = computed(() => {
        return shipmentPrices[shipmentType.value] || 0;
    });

    const totalPrice = computed(() => {
        return (parseFloat(totalArticlesPrice.value) + parseFloat(shipmentPrice.value)).toFixed(2);
    });

    function addProductToCart(product) {
        lines.value.push(product);
    }

    function removeProductFromCart(product) {
        const index = lines.value.findIndex((line) => line.id === product.id);
        if (index !== -1) {
            lines.value.splice(index, 1);
        }
    }

    function updateShipmentType(type) {
        if (shipmentPrices[type] !== undefined) {
            shipmentType.value = type;
        }
    }

    return {
        lines,
        shipmentType,
        totalArticles,
        totalArticlesPrice,
        shipmentPrice,
        totalPrice,
        addProductToCart,
        removeProductFromCart,
        updateShipmentType,
    };
});*/





/*import { defineStore } from "pinia";
//import { Lines } from '../models/Lines';
//import { Shipment } from '../models/Shipment';
import { ref, computed } from "vue";

export const useCartStore = defineStore('cart', () => {
    const lines = ref([]);
    const shipmentType = ref('relais'); // Relais colis par défaut

    function addProductToCart(article) {
        const existingLine = lines.value.find(line => line.id === article.id);
        if (existingLine) {
            existingLine.quantity++;
        } else {
            lines.value.push({ ...article, quantity: 1 });
        }
    }
    function removeProductFromCart(article) {
        const index = lines.value.findIndex(line => line.id === article.id);
        if (index !== -1) {
            lines.value.splice(index, 1);
        }
    }
    function updateShipmentType(type) {
        shipmentType.value = type;
        //calculateShipmentPrice();
    }

   // function calculateShipmentPrice() {
    //    shipmentPrice.value = shipmentType.value === 'relais' ? 5 : 12;
    //}

    const totalArticles = computed(() => lines.value.reduce((sum, line) => sum + line.quantity, 0));
    const totalArticlesPrice = computed(() => lines.value.reduce((sum, line) => sum + line.price * line.quantity, 0));
    const shipmentPrice = computed(() => shipmentType.value === 'relais' ? 5 : 12);
    const totalPrice = computed(() => totalArticlesPrice.value + shipmentPrice.value);

    return {
        lines,
        addProductToCart,
        removeProductFromCart,
        updateShipmentType,
        totalArticles,
        totalArticlesPrice,
        shipmentPrice,
        totalPrice
    };
});*/


/*export const useCartStore = defineStore('cart', {
    state: () => ({
        lines: new Lines(),
        shipment: new Shipment()
    }),
    actions: {
        addProductToCart(product) {
            const existingLine = this.lines.lines.find(line => line.name === product.name);
            if (existingLine) {
                existingLine.updateQuantity(existingLine.quantity + 1);
            } else {
                this.lines.addLine(product);
            }
        },
        removeProductFromCart(product) {
            this.lines.removeLine(product);
        },
        updateShipmentType(type) {
            this.shipment.setShipmentType(type);
        }
    },
    getters: {
        totalArticles: (state) => state.lines.calculateTotalArticles(),
        totalArticlesPrice: (state) => state.lines.calculateTotalArticlesPrice(),
        shipmentPrice: (state) => state.shipment.price,
        totalPrice: (state) => state.lines.calculateTotalArticlesPrice() + state.shipment.price
    }
});*/






/*export const useCartStore = defineStore("cart", {
    state: () => ({
        items: [],
    }),
    getters: {
        itemCount: (state) => state.items.length,
        totalPrice: (state) =>
            state.items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    },
    actions: {
        addItem(product) {
            const existingItem = this.items.find((item) => item.id === product.id);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                this.items.push({ ...product, quantity: 1 });
            }
        },
        removeItem(productId) {
            this.items = this.items.filter((item) => item.id !== productId);
        },
        clearCart() {
            this.items = [];
        },
    },
});*/
