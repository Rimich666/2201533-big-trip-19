import Item from './item';
import {SubmitMode} from '../../settings';

export default class ItemNewForm extends Item {
  list;
  #point;
  #onSubmit;
  #onCancel;

  constructor(form) {
    super(form);
    this.element.append(this._form.getElement());
  }

  set onCancel(onCancel) {
    this.#onCancel = onCancel;
  }

  set onSubmit(onSubmit) {
    this.#onSubmit = onSubmit;
  }

  set point(point) {
    this.#point = point;
  }

  showForm = () => {
    super.prepareForm(this);
    this._form.point = this.#point;
    this._form.buttonCancel.textContent = 'Cancel';
    this.element.append(this._form.getElement());
    this.list.prepend(this.element);
    super.showForm();
  };

  cancel() {
    this.hideForm();
  }

  submit() {
    this.#onSubmit(SubmitMode.ADD, this._form.point, this._form.buttonSubmit);
  }

  hideForm = () => {
    this.element.remove();
    this._form.default();
    this._form.owner = null;
    this.#onCancel();
  };
}
