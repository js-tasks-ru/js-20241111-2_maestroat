export default class NotificationMessage {
  constructor(text = "", parameters = {}) {
    const { duration = 2000, type = "success" } = parameters;
    this.text = text;
    this.duration = duration;
    this.type = type;
    this.element = this.createElement(this.notificationElement());
  }
  static value = null;
  createElement(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.firstElementChild;
  }
  notificationElement() {
    return `
    <div class="notification ${this.type}" style="--value:${this.duration}s">
      <div class="timer"></div>
      <div class="inner-wrapper">
        <div class="notification-header">${this.type}</div>
        <div class="notification-body">${this.text}</div>
      </div>
    </div>
    `;
  }
  show(target = document.body) {
    if (NotificationMessage.value) {
      NotificationMessage.value.destroy();
    }
    NotificationMessage.value = this;

    target.appendChild(this.element);
    this.timer();
  }
  remove() {
    this.element.remove();
  }
  destroy() {
    this.remove();
  }
  timer() {
    setTimeout(() => {
      this.destroy();
    }, this.duration);
  }
}
