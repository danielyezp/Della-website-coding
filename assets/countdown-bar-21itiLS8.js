import{a as o,t as r}from"./evx.es-DeZd_zDv.js";import{C as e}from"./countdown-timer-BRgX0rGv.js";import{i as a}from"./intersection-watcher-8GvknGdC.js";import{d as s}from"./delay-offset-G3BUmTZ-.js";import{s as i}from"./shouldAnimate-DkS0yM7E.js";import"./media-queries-CokWIw5y.js";const m={items:`
  .sales-banner__bar-item--heading,
  .sales-banner__bar-text,
  .sales-banner__button,
  .countdown-banner__bar-item--heading,
  .countdown-banner__bar-item--timer,
  .countdown-banner__bar-text,
  .countdown-banner__button`},d=t=>{const n=a(t);return s(t,[m.items]),{destroy(){n==null||n.destroy()}}},c={timer:"[data-countdown-timer]"};o("countdown-bar",{onLoad(){const t=r(c.timer,this.container);this.countdownTimers=[],t.forEach(n=>{this.countdownTimers.push(e(n))}),i(this.container)&&(this.animateCountdownBar=d(this.container))},onUnload(){var t;(t=this.animateCountdownBar)==null||t.destroy(),this.countdownTimers.forEach(n=>n.destroy())}});
