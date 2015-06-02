import ModalService from '../../src/backbone-service-modals';
import {View, history} from 'backbone';

describe('ModalService', function() {
  beforeEach(function() {
    this.ModalService = ModalService.extend({
      render: stub(),
      remove: stub(),
      animateIn: stub(),
      animateOut: stub(),
      animateSwap: stub(),
    });
  });

  describe('#open', function() {
    beforeEach(function() {
      this.modalService = new this.ModalService();
      spy(this.modalService, 'trigger');
    });

    describe('when no other modals are open', function() {
      beforeEach(function() {
        this.view = new View();
        this.options = {};
      });

      it('should trigger a "before:open" event', function() {
        return this.modalService.open(this.view, this.options).then(() => {
          expect(this.modalService.trigger)
            .to.have.been.calledWith('before:open', this.view, this.options);
        });
      });

      it('should render the view', function() {
        return this.modalService.open(this.view, this.options).then(() => {
          expect(this.modalService.render)
            .to.have.been.calledWith(this.view, this.options);
        });
      });

      it('should animate the view in', function() {
        return this.modalService.open(this.view, this.options).then(() => {
          expect(this.modalService.animateIn)
            .to.have.been.calledWith(this.view, this.options);
        });
      });

      it('should trigger a "before:open" event', function() {
        this.modalService.render = () => {
          expect(this.modalService.trigger)
            .to.have.been.calledWith('before:open', this.view, this.options);
        };

        return this.modalService.open(this.view, this.options);
      });

      it('should trigger a "open" event', function() {
        return this.modalService.open(this.view, this.options).then(() => {
          expect(this.modalService.trigger)
            .to.have.been.calledWith('open', this.view, this.options);
        });
      });
    });

    describe('when another modal is open', function() {
      beforeEach(function() {
        this.view1 = new View();
        this.view2 = new View();
        this.options = {};
        return this.modalService.open(this.view1);
      });

      it('should render the view', function() {
        return this.modalService.open(this.view2, this.options).then(() => {
          expect(this.modalService.render)
            .to.have.been.calledWith(this.view2, this.options);
        });
      });

      it('should animate the swapping of the views', function() {
        return this.modalService.open(this.view2, this.options).then(() => {
          expect(this.modalService.animateSwap)
            .to.have.been.calledWith(this.view1, this.view2, this.options);
        });
      });

      it('should trigger a "before:open" event', function() {
        this.modalService.render = () => {
          expect(this.modalService.trigger)
            .to.have.been.calledWith('before:open', this.view2, this.options);
        };

        return this.modalService.open(this.view2, this.options);
      });

      it('should trigger a "open" event', function() {
        return this.modalService.open(this.view2, this.options).then(() => {
          expect(this.modalService.trigger)
            .to.have.been.calledWith('open', this.view2, this.options);
        });
      });
    });
  });

  describe('#close', function() {
    beforeEach(function() {
      this.modalService = new this.ModalService();
      spy(this.modalService, 'trigger');
    });

    describe('when no other modals were previously open', function() {
      beforeEach(function() {
        this.view = new View();
        this.options = {};
        return this.modalService.open(this.view);
      });

      it('should animate the view out', function() {
        return this.modalService.close(this.view, this.options).then(() => {
          expect(this.modalService.animateOut)
            .to.have.been.calledWith(this.view, this.options);
        });
      });

      it('should remove the view', function() {
        return this.modalService.close(this.view, this.options).then(() => {
          expect(this.modalService.remove)
            .to.have.been.calledWith(this.view, this.options);
        });
      });

      it('should trigger a "before:close" event', function() {
        this.modalService.remove = () => {
          expect(this.modalService.trigger)
            .to.have.been.calledWith('before:close', this.view, this.options);
        };

        return this.modalService.close(this.view, this.options);
      });

      it('should trigger a "close" event', function() {
        return this.modalService.close(this.view, this.options).then(() => {
          expect(this.modalService.trigger)
            .to.have.been.calledWith('close', this.view, this.options);
        });
      });
    });

    describe('when another modal was previously open', function() {
      beforeEach(function() {
        this.view1 = new View();
        this.view2 = new View();
        this.options = {};
        return this.modalService.open(this.view1).then(() => {
          return this.modalService.open(this.view2);
        });
      });

      it('should animate the swapping of the views', function() {
        return this.modalService.close(this.view2, this.options).then(() => {
          expect(this.modalService.animateSwap)
            .to.have.been.calledWith(this.view2, this.view1, this.options);
        });
      });

      it('should remove the view', function() {
        return this.modalService.close(this.view2, this.options).then(() => {
          expect(this.modalService.remove)
            .to.have.been.calledWith(this.view2, this.options);
        });
      });

      it('should trigger a "before:close" event', function() {
        this.modalService.remove = () => {
          expect(this.modalService.trigger)
            .to.have.been.calledWith('before:close', this.view2, this.options);
        };

        return this.modalService.close(this.view2, this.options);
      });

      it('should trigger a "close" event', function() {
        return this.modalService.close(this.view2, this.options).then(() => {
          expect(this.modalService.trigger)
            .to.have.been.calledWith('close', this.view2, this.options);
        });
      });
    });

    describe('when closing all modals', function() {
      beforeEach(function() {
        this.view1 = {view1: true};
        this.view2 = {view2: true};
        this.options = {};
        return this.modalService.open(this.view1).then(() => {
          return this.modalService.open(this.view2);
        });
      });

      it('should animate the current view out', function() {
        return this.modalService.close(null, this.options).then(() => {
          expect(this.modalService.animateOut)
            .to.have.been.calledWith(this.view2, this.options);
        });
      });

      it('should remove ALL OF THE VIEWS!!!', function() {
        return this.modalService.close(null, this.options).then(() => {
          expect(this.modalService.remove)
            .to.have.been.calledWith(this.view1, this.options)
            .and.calledWith(this.view2, this.options);
        });
      });

      it('should trigger a "before:close" event', function() {
        this.modalService.remove = () => {
          expect(this.modalService.trigger)
            .to.have.been.calledWith('before:close', this.view1, this.options);
          expect(this.modalService.trigger)
            .to.have.been.calledWith('before:close', this.view2, this.options);
        };

        return this.modalService.close(null, this.options);
      });

      it('should trigger a "close" event', function() {
        return this.modalService.close(null, this.options).then(() => {
          expect(this.modalService.trigger)
            .to.have.been.calledWith('close', this.view1, this.options);
          expect(this.modalService.trigger)
            .to.have.been.calledWith('close', this.view2, this.options);
        });
      });
    });
  });

  describe('#alert', function() {
    beforeEach(function() {
      this.alertView = new View();
      this.ModalService = this.ModalService.extend({
        AlertView: stub().returns(this.alertView)
      });
      this.modalService = new this.ModalService();
      spy(this.modalService, 'open');
      spy(this.modalService, 'close');
      spy(this.modalService, 'trigger');
      this.options = {};
    });

    it('should open the alert modal and resolve on confirm', function() {
      this.modalService.on('open', () => this.alertView.trigger('confirm'));

      return this.modalService.alert().then(() => {
        expect(this.modalService.open).to.have.been.calledWith(this.alertView);
        expect(this.modalService.close).to.have.been.calledWith(this.alertView);
      });
    });

    it('should open the alert modal and close on cancel', function() {
      this.modalService.on('open', () => this.alertView.trigger('cancel'));

      return this.modalService.alert().then(() => {
        expect(this.modalService.open).to.have.been.calledWith(this.alertView);
        expect(this.modalService.close).to.have.been.calledWith(this.alertView);
      });
    });

    it('should trigger a "before:alert" event', function() {
      this.modalService.on('open', () => {
        expect(this.modalService.trigger)
          .to.have.been.calledWith('before:alert', this.alertView, this.options);
        this.alertView.trigger('confirm');
      });

      return this.modalService.alert(this.options);
    });

    it('should trigger a "alert" event', function() {
      this.modalService.on('open', () => this.alertView.trigger('confirm'));

      return this.modalService.alert(this.options).then(() => {
        expect(this.modalService.trigger)
          .to.have.been.calledWith('alert', null, this.alertView, this.options);
      });
    });
  });

  describe('#confirm', function() {
    beforeEach(function() {
      this.confirmView = new View();
      this.ModalService = this.ModalService.extend({
        ConfirmView: stub().returns(this.confirmView)
      });
      this.modalService = new this.ModalService();
      spy(this.modalService, 'open');
      spy(this.modalService, 'close');
      spy(this.modalService, 'trigger');
      this.options = {};
    });

    it('should open the confirm modal and resolve with true on confirm', function() {
      let confirm = this.modalService.confirm();

      Promise.resolve().then(() => this.confirmView.trigger('confirm'));

      return confirm.then(result => {
        expect(result).to.be.true;
        expect(this.modalService.open).to.have.been.calledWith(this.confirmView);
        expect(this.modalService.close).to.have.been.calledWith(this.confirmView);
      });
    });

    it('should open the confirm modal and close with false on cancel', function() {
      let confirm = this.modalService.confirm();

      Promise.resolve().then(() => this.confirmView.trigger('cancel'));

      return confirm.then(result => {
        expect(result).to.be.false;
        expect(this.modalService.open).to.have.been.calledWith(this.confirmView);
        expect(this.modalService.close).to.have.been.calledWith(this.confirmView);
      });
    });

    it('should trigger a "before:confirm" event', function() {
      this.modalService.on('open', () => {
        expect(this.modalService.trigger)
          .to.have.been.calledWith('before:confirm', this.confirmView, this.options);
        this.confirmView.trigger('confirm');
      });

      return this.modalService.confirm(this.options);
    });

    it('should trigger a "confirm" event', function() {
      this.modalService.on('open', () => this.confirmView.trigger('confirm'));

      return this.modalService.confirm(this.options).then(() => {
        expect(this.modalService.trigger)
          .to.have.been.calledWith('confirm', true, this.confirmView, this.options);
      });
    });
  });

  describe('#prompt', function() {
    beforeEach(function() {
      this.promptView = new View();
      this.ModalService = this.ModalService.extend({
        PromptView: stub().returns(this.promptView)
      });
      this.modalService = new this.ModalService();
      spy(this.modalService, 'open');
      spy(this.modalService, 'close');
      spy(this.modalService, 'trigger');
      this.options = {};
    });

    it('should open the prompt modal and resolve with string on submit', function() {
      this.modalService.on('open', () => this.promptView.trigger('submit', 'myString'));

      return this.modalService.prompt().then(result => {
        expect(result).to.equal('myString');
        expect(this.modalService.open).to.have.been.calledWith(this.promptView);
        expect(this.modalService.close).to.have.been.calledWith(this.promptView);
      });
    });

    it('should open the prompt modal and close with undefined on cancel', function() {
      this.modalService.on('open', () => this.promptView.trigger('cancel', 'devilsAdvocateString'));

      return this.modalService.prompt().then(result => {
        expect(result).to.be.undefined;
        expect(this.modalService.open).to.have.been.calledWith(this.promptView);
        expect(this.modalService.close).to.have.been.calledWith(this.promptView);
      });
    });

    it('should trigger a "before:prompt" event', function() {
      this.modalService.on('open', () => {
        expect(this.modalService.trigger)
          .to.have.been.calledWith('before:prompt', this.promptView, this.options);
        this.promptView.trigger('submit', 'myString');
      });

      return this.modalService.prompt(this.options);
    });

    it('should trigger a "prompt" event', function() {
      this.modalService.on('open', () => this.promptView.trigger('submit', 'myString'));

      return this.modalService.prompt(this.options).then(() => {
        expect(this.modalService.trigger)
          .to.have.been.calledWith('prompt', 'myString', this.promptView, this.options);
      });
    });
  });

  describe('#isOpen', function() {
    beforeEach(function() {
      this.modalService = new this.ModalService();
    });

    it('should return false when never opened', function() {
      expect(this.modalService.isOpen()).to.be.false;
    });

    it('should return true when opened', function() {
      return this.modalService.open().then(() => {
        expect(this.modalService.isOpen()).to.be.true;
      });
    });

    it('should return false after closed', function() {
      return this.modalService.open().then(() => {
        return this.modalService.close();
      }).then(() => {
        expect(this.modalService.isOpen()).to.be.false;
      });
    });
  });

  describe('requests', function() {
    beforeEach(function() {
      this.modalService = new this.ModalService();
    });

    it('should have a request for open', function() {
      stub(this.modalService, 'open');
      return this.modalService.request('open').then(() => {
        expect(this.modalService.open).to.have.been.called;
      });
    });

    it('should have a request for close', function() {
      stub(this.modalService, 'close');
      return this.modalService.request('close').then(() => {
        expect(this.modalService.close).to.have.been.called;
      });
    });

    it('should have a request for alert', function() {
      stub(this.modalService, 'alert');
      return this.modalService.request('alert').then(() => {
        expect(this.modalService.alert).to.have.been.called;
      });
    });

    it('should have a request for confirm', function() {
      stub(this.modalService, 'confirm');
      return this.modalService.request('confirm').then(() => {
        expect(this.modalService.confirm).to.have.been.called;
      });
    });

    it('should have a request for prompt', function() {
      stub(this.modalService, 'prompt');
      return this.modalService.request('prompt').then(() => {
        expect(this.modalService.prompt).to.have.been.called;
      });
    });
  });

  describe('Backbone.history', function() {
    beforeEach(function() {
      this.view1 = new View();
      this.view2 = new View();
      this.modalService = new this.ModalService();

      spy(this.modalService, 'close');

      history.fragment = 'current';

      return Promise.all([
        this.modalService.open(this.view1),
        this.modalService.open(this.view2),
      ]);
    });

    it('should close all modals when changing routes', function() {
      history.fragment = 'new-route';
      history.trigger('route');

      return Promise.resolve().then(() => {
        expect(this.modalService.close).to.have.been.called;
      });
    });

    it('should not close all modals when not route change is fired on the same route', function() {
      history.trigger('route');

      return Promise.resolve().then(() => {
        expect(this.modalService.close).not.to.have.been.called;
      });
    });
  });
});
