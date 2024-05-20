import { computed, ref } from 'vue';

export class Line {
    constructor(name, unitPrice = 0, quantity = 0) {
        this.name = ref(name);
        this.unitPrice = ref(unitPrice);
        this.quantity = ref(quantity);
        this.total = computed(() => this.calculateTotal());
    }

    calculateTotal() {
        return this.unitPrice.value * this.quantity.value;
    }

    updateQuantity(newQuantity) {
        this.quantity.value = newQuantity;
    }
}



/*export class Line {
    constructor(name, unitPrice = 0, quantity = 0) {
        this.name = name;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
        this.total = this.calculateTotal();
    }

    calculateTotal() {
        return this.unitPrice * this.quantity;
    }

    updateQuantity(newQuantity) {
        this.quantity = newQuantity;
        this.total = this.calculateTotal();
    }
}*/
