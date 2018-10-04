import Vue from 'vue';
import MainWindow from '@/components/MainWindow';

describe('MainWindow.vue', () => {
  it('should render correct contents', () => {
    const vm = new Vue({
      el: document.createElement('div'),
      render: h => h(MainWindow),
    }).$mount();

    expect(vm.$el.querySelector('.title').textContent).to.contain('Request Rocket');
  });
});
