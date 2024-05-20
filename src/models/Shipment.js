import { ref, computed } from 'vue';

export class Shipment {
    constructor() {
        this.type = ref('relais'); // Par défaut à relais
        this.price = computed(() => this.calculatePrice());
    }

    setShipmentType(type) {
        this.type.value = type;
    }

    calculatePrice() {
        return this.type.value === 'relais' ? 5 : (this.type.value === 'domicile' ? 12 : 0);
    }
}


/*export class Shipment {
    constructor() {
        this.type = 'relais'; // Par défaut à relais
        this.calculatePrice(); // Initialiser le prix
    }

    setShipmentType(type) {
        this.type = type;
        this.calculatePrice();
    }

    calculatePrice() {
        this.price = this.type === 'relais' ? 5 : (this.type === 'domicile' ? 12 : 0);
    }
}*/
