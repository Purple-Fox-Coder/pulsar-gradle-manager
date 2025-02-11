'use strict';

const { View, $ } = require('space-pen');
const LeftTaskView = require('./left-task-view.coffee');

class LeftPane extends View {
  // Define static content method as per CoffeeScript's class-level @content
  static content() {
    // Equivalent to: @div class:'left-pane', =>
    this.div({ class: 'left-pane' }, () => {
      // Equivalent to: @div outlet: 'resizeHandle', class: 'resize-handle'
      this.div({ outlet: 'resizeHandle', class: 'resize-handle' });
      // Equivalent to: @div class:'left-container', =>
      this.div({ class: 'left-container' }, () => {
        // Equivalent to: @div outlet:'body',class:'title-bar','Gradle Tasks'
        this.div({ outlet: 'body', class: 'title-bar' }, 'Gradle Tasks');
        // Equivalent to: @subview 'taskView',new LeftTaskView()
        this.subview('taskView', new LeftTaskView());
      });
    });
  }

  constructor(...args) {
    super(...args);
    // Bind arrow functions to preserve CoffeeScript fat arrow behavior

    // Equivalent to: resizeStarted: =>
    this.resizeStarted = () => {
      // Equivalent to: $(document).on 'mousemove', @resizePane
      $(document).on('mousemove', this.resizePane);
      // Equivalent to: $(document).on 'mouseup', @resizeStopped
      $(document).on('mouseup', this.resizeStopped);
    };

    // Equivalent to: resizeStopped: =>
    this.resizeStopped = () => {
      // Equivalent to: $(document).off 'mousemove', @resizePane
      $(document).off('mousemove', this.resizePane);
      // Equivalent to: $(document).off 'mouseup', @resizeStopped
      $(document).off('mouseup', this.resizeStopped);
    };

    // Equivalent to: resizePane: ({pageX,pageY, which}) ->
    this.resizePane = ({ pageX, pageY, which }) => {
      // Calculate width = $(document.body).width() - pageX
      const width = $(document.body).width() - pageX;
      // Set width of .left-pane element
      $('.left-pane').width(width);
      // Trigger update event
      $('.left-pane').trigger('update');
      // Bind an empty update handler as per CoffeeScript code
      $('.left-pane').on('update', function() {});
    };
  }

  // Equivalent to: handleEvents: ->
  handleEvents() {
    // Bind the mousedown event on .resize-handle to call resizeStarted with event parameter
    this.on('mousedown', '.resize-handle', (e) => this.resizeStarted(e));
  }

  // Equivalent to: initialize:->
  initialize() {
    //    @emitter = new Emitter()
    // Call handleEvents to set up event handlers
    this.handleEvents();
  }

  // Equivalent to: refresh: (outputView,tasks) ->
  refresh(outputView, tasks) {
    this.taskView.refresh(outputView, tasks);
  }

  // Equivalent to: clear:->
  clear() {
    this.taskView.clear();
  }

  // Equivalent to: destroy:->
  destroy() {
    this.resizeStopped();
    this.remove();
  }
}

module.exports = LeftPane;
