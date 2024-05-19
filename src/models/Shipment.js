export class Shipment {
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
}
