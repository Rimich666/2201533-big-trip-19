import dayjs from 'dayjs';

export default class Point {
  #fullPrice = 0;
  basePrice;
  dateFrom;
  dateTo;
  destination = -1;
  id = -1;
  isFavorite = false;
  offers = [];
  type = '';

  constructor(basePrice, dateFrom , dateTo, destination, id , isFavorite, offers, type) {
    this.basePrice = basePrice || 0;
    this.dateFrom = dateFrom || dayjs();
    this.dateTo = dateTo || dayjs();
    this.destination = destination;
    this.id = id;
    this.isFavorite = isFavorite || this.isFavorite;
    this.offers = offers || this.offers;
    this.type = type;
  }

  get entries() {
    return Object.entries(this).filter((value) => typeof(value[1]) !== 'function');
  }

  get pricePoint() {
    return this.#fullPrice;
  }

  get forAddPoint() {
    const pointAsJson = {};
    this.entries.forEach(([key, value]) => {
      if (key !== 'id') {
        pointAsJson[this.#newKey(key)] = value;
      }
    });
    return pointAsJson;
  }

  get forAlterPoint() {
    const fields = [];
    this.entries.forEach(([key, value]) => {
      if (key === 'id') {
        fields.push(`"id": "${JSON.stringify(value)}"`);
      } else {
        fields.push(`${JSON.stringify(this.#newKey(key))}: ${JSON.stringify(value)}`);
      }
    });
    return `{${fields.join(', ')}}`;
  }

  get copy() {
    if (this.id === -1) {
      return this;
    }
    const point = new Point();
    this.entries.forEach(([key, value]) => {
      if (key === 'offers') {
        point.offers = Array.from(this.offers);
      } else {
        point[key] = value;
      }
    });
    return point;
  }

  recalculate = (owner) => {
    this.#fullPrice = this.offers.reduce((accumulator, currentValue) =>
      accumulator + owner.typeOfOffers[this.type].find((offer) => offer.id === currentValue).price
    , this.basePrice);
  };

  #newKey = (oldKey) => {
    let newKey = oldKey;
    [...newKey].forEach((char) => {
      if (char === char.toUpperCase()) {
        newKey = newKey.replace(char, `_${char.toLowerCase()}`);
      }
    });
    return newKey;
  };

  equalField = (point, key) => {
    if (key === 'offers') {
      if (point.offers.length !== this.offers.length) {
        return false;
      }
      return point.offers.every((value) => this.offers.includes(value));
    }
    return point[key] === this[key];
  };

  equal = (point) => {
    for (const key of Object.keys(this)) {
      if (!this.equalField(point, key)) {
        return false;
      }
    }
    return true;
  };

  alter = (point) => {
    const alter = [];
    point.entries.forEach(([key, value]) => {
      if (!this.equalField(point, key)) {
        this[key] = value;
        alter.push(key);
      }
    });
    return alter;
  };
}
