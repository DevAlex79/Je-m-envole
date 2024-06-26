import { reactive } from 'vue';

export class Lines {
    constructor() {
        this.lines = reactive([]);
    }

    /* addLine(line) {
        line.quantity = line.quantity || 1;
        line.total = line.total || (line.unitPrice ? line.quantity * line.unitPrice : 0);
        this.lines.push(line);
    }*/
    addLine(line) {
        const existingLine = this.lines.find(l => l.id === line.id);
        if (existingLine) {
            existingLine.quantity += line.quantity;
            existingLine.total = existingLine.unitPrice * existingLine.quantity;
        } else {
            line.unitPrice = line.unitPrice || 0;
            line.total = line.unitPrice * line.quantity;
            this.lines.push(line);
        }
    }

    removeLine(lineToRemove) {
        const indexToRemove = this.lines.indexOf(lineToRemove);
        if (indexToRemove !== -1) {
            this.lines.splice(indexToRemove, 1);
        }
    }

    calculateTotalArticles() {
        return this.lines.reduce((total, line) => total + (line.quantity || 0), 0);
    }

    calculateTotalArticlesPrice() {
        return this.lines.reduce((total, line) => total + (line.total || 0), 0);
    }
    /*calculateTotalArticles() {
        return this.lines.reduce((total, line) => total + line.quantity, 0);
    }

    calculateTotalArticlesPrice() {
        return this.lines.reduce((total, line) => total + line.total, 0);
    }*/
}



/*import { reactive } from 'vue';

export class Lines {
    constructor() {
        this.lines = reactive([]);
    }

    addLine(line) {
        this.lines.push(line);
    }

    removeLine(lineToRemove) {
        const indexToRemove = this.lines.indexOf(lineToRemove);
        if (indexToRemove !== -1) {
            this.lines.splice(indexToRemove, 1);
        }
    }

    calculateTotalArticles() {
        return this.lines.reduce((total, line) => total + line.quantity, 0);
    }

    calculateTotalArticlesPrice() {
        return this.lines.reduce((total, line) => total + line.total, 0);
    }
}*/
