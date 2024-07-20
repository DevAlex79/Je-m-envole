import { reactive, computed, watchEffect } from 'vue';

const shipment = reactive({
    type: 'relais',
    price: 5
});

watchEffect(() => {
    shipment.price = calculatePrice(shipment.type);
});

function calculatePrice(type) {
    switch (type) {
        case 'relais':
            return 5;
        case 'domicile':
            return 12;
        default:
            return 0;
    }
}

export default shipment;

/*const shipment = reactive({
    type: 'relais', // Par défaut à relais
    calculatePrice() {
        switch (this.type) {
            case 'relais':
                return 5;
            case 'domicile':
                return 12;
            default:
                return 0;
        }
    },
    price: computed(() => shipment.calculatePrice())
});

export default shipment; */


/*// Modèle livraison
export default class Shipment {
    constructor() {
        this.type = 'relais'; // Par défaut à relais
    }

    calculatePrice() {
        switch (this.type) {
            case 'relais':
                return 5;
            case 'domicile':
                return 12;
            default:
                return 0;
        }
    }

    setShipmentType(type) {
        this.type = type;
    }

    get price() {
        return this.calculatePrice();
    }
}*/


/*import { reactive, computed } from 'vue';

// Modèle livraison
const shipment = reactive({
    type: 'relais', // Par défaut à relais
    calculatePrice() {
        switch (this.type) {
            case 'relais':
                return 5;
            case 'domicile':
                return 12;
            default:
                return 0;
        }
    },
    price: computed(() => shipment.calculatePrice())
});

export default shipment;*/



/*import { ref, computed } from 'vue';

export class Shipment {
    constructor() {
        this.type = ref('relais'); // Initialiser comme une référence
        this.price = computed(() => this.calculatePrice());
    }

    setShipmentType(type) {
        this.type.value = type;
    }

    calculatePrice() {
        switch (this.type.value) {
            case 'relais':
                return 5;
            case 'domicile':
                return 12;
            default:
                return 0;
        }
    }
}*/



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
