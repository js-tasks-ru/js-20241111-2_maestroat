export default class RangePicker {
  static formatDate(date) {
    return date.toLocaleString('ru', {dateStyle: 'short'});
  }
  onDocumentClick = event => {
    const isOpen = this.element.classList.contains('rangepicker_open');
    const isRangePicker = this.element.contains(event.target);

    if (isOpen && !isRangePicker) {
      this.close();
    }
  };
  constructor({from, to}) {
    this.showDateFrom = new Date(from);
    this.from = from;
    this.to = to;
    this.element = this.createElement(this.template());
    this.subElements = {};
    this.selectingFrom = true;
    this.selectSubElements();
    this.createListeners();
  }
  createElement(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.firstElementChild;
  }
  selectSubElements() {
    this.element.querySelectorAll("[data-element]").forEach((element) => {
      this.subElements[element.dataset.element] = element;
    });
  }
  createListeners() {
    document.addEventListener("click", this.onDocumentClick, !0);
    this.subElements.input.addEventListener("click", this.toggle);
    this.subElements.selector.addEventListener('click', this.onSelectorClick);
  }
  destroyListeners() {
    document.removeEventListener('click', this.onDocumentClick, true);
    this.subElements.input.removeEventListener("click", this.toggle);
    this.subElements.selector.removeEventListener('click', this.onSelectorClick);

  }
  toggle = () => {
    this.element.classList.toggle('rangepicker_open');
    this.renderDateRangePicker();
  }
  close() {
    this.element.classList.remove('rangepicker_open');
  }
  template() {
    const from = RangePicker.formatDate(this.from);
    const to = RangePicker.formatDate(this.to);

    return `<div class="rangepicker">
      <div class="rangepicker__input" data-element="input">
        <span data-element="from">${from}</span> -
        <span data-element="to">${to}</span>
      </div>
      <div class="rangepicker__selector" data-element="selector"></div>
    </div>`;
  }
  renderDateRangePicker() {
    const showDate1 = new Date(this.showDateFrom);
    const showDate2 = new Date(this.showDateFrom);
    const { selector } = this.subElements;

    showDate2.setMonth(showDate2.getMonth() + 1);

    selector.innerHTML = `
      <div class="rangepicker__selector-arrow"></div>
      <div class="rangepicker__selector-control-left"></div>
      <div class="rangepicker__selector-control-right"></div>
      ${this.renderCalendar(showDate1)}
      ${this.renderCalendar(showDate2)}
    `;

    const controlLeft = selector.querySelector('.rangepicker__selector-control-left');
    const controlRight = selector.querySelector('.rangepicker__selector-control-right');

    controlLeft.addEventListener('click', () => this.prev());
    controlRight.addEventListener('click', () => this.next());

    this.renderHighlight();
  }

  prev() {
    this.showDateFrom.setMonth(this.showDateFrom.getMonth() - 1);
    this.renderDateRangePicker();
  }

  next() {
    this.showDateFrom.setMonth(this.showDateFrom.getMonth() + 1);
    this.renderDateRangePicker();
  }

  renderHighlight() {
    for (const cell of this.element.querySelectorAll('.rangepicker__cell')) {
      const { value } = cell.dataset;
      const cellDate = new Date(value);

      cell.classList.remove('rangepicker__selected-from');
      cell.classList.remove('rangepicker__selected-between');
      cell.classList.remove('rangepicker__selected-to');

      if (this.from && value === this.from.toISOString()) {
        cell.classList.add('rangepicker__selected-from');
      } else if (this.to && value === this.to.toISOString()) {
        cell.classList.add('rangepicker__selected-to');
      } else if (this.from && this.to && cellDate >= this.from && cellDate <= this.to) {
        cell.classList.add('rangepicker__selected-between');
      }
    }

    if (this.from) {
      const selectedFromElem = this.element.querySelector(`[data-value="${this.from.toISOString()}"]`);
      if (selectedFromElem) {
        selectedFromElem.closest('.rangepicker__cell').classList.add('rangepicker__selected-from');
      }
    }

    if (this.to) {
      const selectedToElem = this.element.querySelector(`[data-value="${this.to.toISOString()}"]`);
      if (selectedToElem) {
        selectedToElem.closest('.rangepicker__cell').classList.add('rangepicker__selected-to');
      }
    }
  }

  renderCalendar(showDate) {
    const date = new Date(showDate);
    const getGridStartIndex = dayIndex => {
      const index = dayIndex === 0 ? 6 : (dayIndex - 1); // make Sunday (0) the last day
      return index + 1;
    };

    date.setDate(1);

    // text-transform: capitalize
    const monthStr = date.toLocaleString('ru', {month: 'long'});

    let table = `<div class="rangepicker__calendar">
      <div class="rangepicker__month-indicator">
        <time datetime=${monthStr}>${monthStr}</time>
      </div>
      <div class="rangepicker__day-of-week">
        <div>Пн</div><div>Вт</div><div>Ср</div><div>Чт</div><div>Пт</div><div>Сб</div><div>Вс</div>
      </div>
      <div class="rangepicker__date-grid">
    `;

    // first day of month starts after a space
    // * * * 1 2 3 4
    table += `
      <button type="button"
        class="rangepicker__cell"
        data-value="${date.toISOString()}"
        style="--start-from: ${getGridStartIndex(date.getDay())}">
          ${date.getDate()}
      </button>`;

    date.setDate(2);

    while (date.getMonth() === showDate.getMonth()) {
      table += `
        <button type="button"
          class="rangepicker__cell"
          data-value="${date.toISOString()}">
            ${date.getDate()}
        </button>`;

      date.setDate(date.getDate() + 1);
    }

    // close the table
    table += '</div></div>';

    return table;
  }
  onSelectorClick = ({target}) => {
    if (target.classList.contains('rangepicker__cell')) {
      this.onRangePickerCellClick(target);
    }
  }
  onRangePickerCellClick(target) {
    const { value } = target.dataset;

    if (value) {
      const dateValue = new Date(value);

      if (this.selectingFrom) {
        this.from = dateValue;
        this.to = null;
        this.selectingFrom = false;
        this.renderHighlight();
      } else {
        if (dateValue > this.from) {
          this.to = dateValue;
        } else {
          this.to = this.from;
          this.from = dateValue;
        }

        this.selectingFrom = true;
        this.renderHighlight();
      }

      if (this.from && this.to) {
        this.dispatchEvent();
        this.close();
        this.subElements.from.innerHTML = RangePicker.formatDate(this.from);
        this.subElements.to.innerHTML = RangePicker.formatDate(this.to);
      }
    }
  }
  dispatchEvent() {
    this.element.dispatchEvent(new CustomEvent('date-select', {
      bubbles: true,
      detail: {
        from: this.from,
        to: this.to
      }
    }));
  }
  remove() {
    this.element.remove();
  }
  destroy() {
    this.remove();
    this.destroyListeners();
  }
}
