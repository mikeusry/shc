// Global Navin JavaScript
;var Navin = Navin || {};

(function($, $$){
  $.extend($$, {}, {
    content: $(),
    footer: $(),
    init: function() {
      $$.content = $('#section-content');
      $$.content.height = $$.content.outerHeight(true);
      $$.footer = $('#zone-footer');
      // Search functions
      $$.initSearch();
      // Resize functions
      $(window).resize(function(){
        $$.resize();
      });
      $$.resize();
    },
    initSearch: function() {
      var form = $('form', $('#block-search-form'));
      if (form.length) {
        var text = form.find('.form-text');
        var submit = form.find('.form-submit');
        var search_text = Drupal.settings.navin.search_text ? Drupal.settings.navin.search_text : 'Search this site...';
        submit.attr('title', search_text);
        if (text.val() == '') {
          text.val(search_text);
        }
        text.focus(function(){
          if (text.val() == search_text) {
            text.val('');
          }
          text.addClass('focus');
          submit.addClass('focus');
        }).blur(function(){
          if (text.val() == '') {
            text.val(search_text);
          }
          text.removeClass('focus');
          submit.removeClass('focus').blur();
        });
        form.submit(function(){
          if (text.val() == search_text) {
            text.val('');
          }
        });
      }
    },
    attach: function(context) {
      // Drupal attachent behaviors
    },
    contentResize: function() {
      // @TODO: Finish out sticky footer for shorter content pages.
      // // Remove content stylings for mobile versions (as the content is wrapped).
      // if (Drupal.omega.getCurrentLayout() == 'mobile') {
      //   $$.content.removeAttr('style');
      // }
      // else {
      //   // Enlarge content height for small content.
      //   if ($$.content.length) {
      //     var height = $$.content.height;
      //     // Get body and document height gap, without the current footer's height
      //     var heightGap = Math.floor($(window).height() - ($('body').outerHeight(true) - $$.content.outerHeight(true)));
      //     // Resize footer to fill gap
      //     if (heightGap > 0) {
      //       height = heightGap;
      //     }
      //     // Ensure content is not hidden
      //     if (height < $$.content.height) {
      //       height = $$.content.height;
      //     }
      //     $$.content.css('height', height + 'px');
      //   }
      // }
    },
    rotatingBannerResize: function() {
      var banner = $('.views-slideshow-cycle-main-frame');
      var slide = $('.views-slideshow-cycle-main-frame-row', banner).filter(':visible');
      var image = $('img', slide);
      banner.height(image.height());
    },
    resize: function() {
      // Resize short content for anchoring footer at bottom.
      $$.contentResize();
      // Resize rotating banner height
      $$.rotatingBannerResize();
    }
  });
  $(document).ready(function(){
    $$.init();
  });
  Drupal.behaviors.navin = {
    attach: function(context){
      $$.attach(context);
    }
  };
})(jQuery, Navin);;
// SpryAccordion.js - version 0.17 - Spry Pre-Release 1.6.1
//
// Copyright (c) 2006. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

(function() { // BeginSpryComponent

if (typeof Spry == "undefined") window.Spry = {}; if (!Spry.Widget) Spry.Widget = {};

Spry.Widget.Accordion = function(element, opts)
{
	this.element = this.getElement(element);
	this.defaultPanel = 0;
	this.hoverClass = "AccordionPanelTabHover";
	this.openClass = "AccordionPanelOpen";
	this.closedClass = "AccordionPanelClosed";
	this.focusedClass = "AccordionFocused";
	this.enableAnimation = true;
	this.enableKeyboardNavigation = true;
	this.currentPanel = null;
	this.animator = null;
	this.hasFocus = null;

	this.previousPanelKeyCode = Spry.Widget.Accordion.KEY_UP;
	this.nextPanelKeyCode = Spry.Widget.Accordion.KEY_DOWN;

	this.useFixedPanelHeights = true;
	this.fixedPanelHeight = 0;

	Spry.Widget.Accordion.setOptions(this, opts, true);

	if (this.element)
		this.attachBehaviors();
};

Spry.Widget.Accordion.prototype.getElement = function(ele)
{
	if (ele && typeof ele == "string")
		return document.getElementById(ele);
	return ele;
};

Spry.Widget.Accordion.prototype.addClassName = function(ele, className)
{
	if (!ele || !className || (ele.className && ele.className.search(new RegExp("\\b" + className + "\\b")) != -1))
		return;
	ele.className += (ele.className ? " " : "") + className;
};

Spry.Widget.Accordion.prototype.removeClassName = function(ele, className)
{
	if (!ele || !className || (ele.className && ele.className.search(new RegExp("\\b" + className + "\\b")) == -1))
		return;
	ele.className = ele.className.replace(new RegExp("\\s*\\b" + className + "\\b", "g"), "");
};

Spry.Widget.Accordion.setOptions = function(obj, optionsObj, ignoreUndefinedProps)
{
	if (!optionsObj)
		return;
	for (var optionName in optionsObj)
	{
		if (ignoreUndefinedProps && optionsObj[optionName] == undefined)
			continue;
		obj[optionName] = optionsObj[optionName];
	}
};

Spry.Widget.Accordion.prototype.onPanelTabMouseOver = function(e, panel)
{
	if (panel)
		this.addClassName(this.getPanelTab(panel), this.hoverClass);
	return false;
};

Spry.Widget.Accordion.prototype.onPanelTabMouseOut = function(e, panel)
{
	if (panel)
		this.removeClassName(this.getPanelTab(panel), this.hoverClass);
	return false;
};

Spry.Widget.Accordion.prototype.openPanel = function(elementOrIndex)
{
	var panelA = this.currentPanel;
	var panelB;

	if (typeof elementOrIndex == "number")
		panelB = this.getPanels()[elementOrIndex];
	else
		panelB = this.getElement(elementOrIndex);
	
	if (!panelB || panelA == panelB)	
		return null;

	var contentA = panelA ? this.getPanelContent(panelA) : null;
	var contentB = this.getPanelContent(panelB);

	if (!contentB)
		return null;

	if (this.useFixedPanelHeights && !this.fixedPanelHeight)
		this.fixedPanelHeight = (contentA.offsetHeight) ? contentA.offsetHeight : contentA.scrollHeight;

	if (this.enableAnimation)
	{
		if (this.animator)
			this.animator.stop();
		this.animator = new Spry.Widget.Accordion.PanelAnimator(this, panelB, { duration: this.duration, fps: this.fps, transition: this.transition });
		this.animator.start();
	}
	else
	{
		if(contentA)
		{
			contentA.style.display = "none";
			contentA.style.height = "0px";
		}
		contentB.style.display = "block";
		contentB.style.height = this.useFixedPanelHeights ? this.fixedPanelHeight + "px" : "auto";
	}

	if(panelA)
	{
		this.removeClassName(panelA, this.openClass);
		this.addClassName(panelA, this.closedClass);
	}

	this.removeClassName(panelB, this.closedClass);
	this.addClassName(panelB, this.openClass);

	this.currentPanel = panelB;

	return panelB;
};

Spry.Widget.Accordion.prototype.closePanel = function()
{
	// The accordion can only ever have one panel open at any
	// give time, so this method only closes the current panel.
	// If the accordion is in fixed panel heights mode, this
	// method does nothing.

	if (!this.useFixedPanelHeights && this.currentPanel)
	{
		var panel = this.currentPanel;
		var content = this.getPanelContent(panel);
		if (content)
		{
			if (this.enableAnimation)
			{
				if (this.animator)
					this.animator.stop();
				this.animator = new Spry.Widget.Accordion.PanelAnimator(this, null, { duration: this.duration, fps: this.fps, transition: this.transition });
				this.animator.start();
			}
			else
			{
				content.style.display = "none";
				content.style.height = "0px";
			}
		}		
		this.removeClassName(panel, this.openClass);
		this.addClassName(panel, this.closedClass);
		this.currentPanel = null;
	}
};

Spry.Widget.Accordion.prototype.openNextPanel = function()
{
	return this.openPanel(this.getCurrentPanelIndex() + 1);
};

Spry.Widget.Accordion.prototype.openPreviousPanel = function()
{
	return this.openPanel(this.getCurrentPanelIndex() - 1);
};

Spry.Widget.Accordion.prototype.openFirstPanel = function()
{
	return this.openPanel(0);
};

Spry.Widget.Accordion.prototype.openLastPanel = function()
{
	var panels = this.getPanels();
	return this.openPanel(panels[panels.length - 1]);
};

Spry.Widget.Accordion.prototype.onPanelTabClick = function(e, panel)
{
	if (panel != this.currentPanel)
		this.openPanel(panel);
	else
		this.closePanel();

	if (this.enableKeyboardNavigation)
		this.focus();

	if (e.preventDefault) e.preventDefault();
	else e.returnValue = false;
	if (e.stopPropagation) e.stopPropagation();
	else e.cancelBubble = true;

	return false;
};

Spry.Widget.Accordion.prototype.onFocus = function(e)
{
	this.hasFocus = true;
	this.addClassName(this.element, this.focusedClass);
	return false;
};

Spry.Widget.Accordion.prototype.onBlur = function(e)
{
	this.hasFocus = false;
	this.removeClassName(this.element, this.focusedClass);
	return false;
};

Spry.Widget.Accordion.KEY_UP = 38;
Spry.Widget.Accordion.KEY_DOWN = 40;

Spry.Widget.Accordion.prototype.onKeyDown = function(e)
{
	var key = e.keyCode;
	if (!this.hasFocus || (key != this.previousPanelKeyCode && key != this.nextPanelKeyCode))
		return true;
	
	var panels = this.getPanels();
	if (!panels || panels.length < 1)
		return false;
	var currentPanel = this.currentPanel ? this.currentPanel : panels[0];
	var nextPanel = (key == this.nextPanelKeyCode) ? currentPanel.nextSibling : currentPanel.previousSibling;

	while (nextPanel)
	{
		if (nextPanel.nodeType == 1 /* Node.ELEMENT_NODE */)
			break;
		nextPanel = (key == this.nextPanelKeyCode) ? nextPanel.nextSibling : nextPanel.previousSibling;
	}

	if (nextPanel && currentPanel != nextPanel)
		this.openPanel(nextPanel);

	if (e.preventDefault) e.preventDefault();
	else e.returnValue = false;
	if (e.stopPropagation) e.stopPropagation();
	else e.cancelBubble = true;

	return false;
};

Spry.Widget.Accordion.prototype.attachPanelHandlers = function(panel)
{
	if (!panel)
		return;

	var tab = this.getPanelTab(panel);

	if (tab)
	{
		var self = this;
		Spry.Widget.Accordion.addEventListener(tab, "click", function(e) { return self.onPanelTabClick(e, panel); }, false);
		Spry.Widget.Accordion.addEventListener(tab, "mouseover", function(e) { return self.onPanelTabMouseOver(e, panel); }, false);
		Spry.Widget.Accordion.addEventListener(tab, "mouseout", function(e) { return self.onPanelTabMouseOut(e, panel); }, false);
	}
};

Spry.Widget.Accordion.addEventListener = function(element, eventType, handler, capture)
{
	try
	{
		if (element.addEventListener)
			element.addEventListener(eventType, handler, capture);
		else if (element.attachEvent)
			element.attachEvent("on" + eventType, handler);
	}
	catch (e) {}
};

Spry.Widget.Accordion.prototype.initPanel = function(panel, isDefault)
{
	var content = this.getPanelContent(panel);
	if (isDefault)
	{
		this.currentPanel = panel;
		this.removeClassName(panel, this.closedClass);
		this.addClassName(panel, this.openClass);

		// Attempt to set up the height of the default panel. We don't want to
		// do any dynamic panel height calculations here because our accordion
		// or one of its parent containers may be display:none.

		if (content)
		{
			if (this.useFixedPanelHeights)
			{
				// We are in fixed panel height mode and the user passed in
				// a panel height for us to use.
	
				if (this.fixedPanelHeight)
					content.style.height = this.fixedPanelHeight + "px";
			}
			else
			{
				// We are in variable panel height mode, but since we can't
				// calculate the panel height here, we just set the height to
				// auto so that it expands to show all of its content.
	
				content.style.height = "auto";
			}
		}
	}
	else
	{
		this.removeClassName(panel, this.openClass);
		this.addClassName(panel, this.closedClass);

		if (content)
		{
			content.style.height = "0px";
			content.style.display = "none";
		}
	}
	
	this.attachPanelHandlers(panel);
};

Spry.Widget.Accordion.prototype.attachBehaviors = function()
{
	var panels = this.getPanels();
	for (var i = 0; i < panels.length; i++)
		this.initPanel(panels[i], i == this.defaultPanel);

	// Advanced keyboard navigation requires the tabindex attribute
	// on the top-level element.

	this.enableKeyboardNavigation = (this.enableKeyboardNavigation && this.element.attributes.getNamedItem("tabindex"));
	if (this.enableKeyboardNavigation)
	{
		var self = this;
		Spry.Widget.Accordion.addEventListener(this.element, "focus", function(e) { return self.onFocus(e); }, false);
		Spry.Widget.Accordion.addEventListener(this.element, "blur", function(e) { return self.onBlur(e); }, false);
		Spry.Widget.Accordion.addEventListener(this.element, "keydown", function(e) { return self.onKeyDown(e); }, false);
	}
};

Spry.Widget.Accordion.prototype.getPanels = function()
{
	return this.getElementChildren(this.element);
};

Spry.Widget.Accordion.prototype.getCurrentPanel = function()
{
	return this.currentPanel;
};

Spry.Widget.Accordion.prototype.getPanelIndex = function(panel)
{
	var panels = this.getPanels();
	for( var i = 0 ; i < panels.length; i++ )
	{
		if( panel == panels[i] )
			return i;
	}
	return -1;
};

Spry.Widget.Accordion.prototype.getCurrentPanelIndex = function()
{
	return this.getPanelIndex(this.currentPanel);
};

Spry.Widget.Accordion.prototype.getPanelTab = function(panel)
{
	if (!panel)
		return null;
	return this.getElementChildren(panel)[0];
};

Spry.Widget.Accordion.prototype.getPanelContent = function(panel)
{
	if (!panel)
		return null;
	return this.getElementChildren(panel)[1];
};

Spry.Widget.Accordion.prototype.getElementChildren = function(element)
{
	var children = [];
	var child = element.firstChild;
	while (child)
	{
		if (child.nodeType == 1 /* Node.ELEMENT_NODE */)
			children.push(child);
		child = child.nextSibling;
	}
	return children;
};

Spry.Widget.Accordion.prototype.focus = function()
{
	if (this.element && this.element.focus)
		this.element.focus();
};

Spry.Widget.Accordion.prototype.blur = function()
{
	if (this.element && this.element.blur)
		this.element.blur();
};

/////////////////////////////////////////////////////

Spry.Widget.Accordion.PanelAnimator = function(accordion, panel, opts)
{
	this.timer = null;
	this.interval = 0;

	this.fps = 60;
	this.duration = 500;
	this.startTime = 0;

	this.transition = Spry.Widget.Accordion.PanelAnimator.defaultTransition;

	this.onComplete = null;

	this.panel = panel;
	this.panelToOpen = accordion.getElement(panel);
	this.panelData = [];
	this.useFixedPanelHeights = accordion.useFixedPanelHeights;

	Spry.Widget.Accordion.setOptions(this, opts, true);

	this.interval = Math.floor(1000 / this.fps);

	// Set up the array of panels we want to animate.

	var panels = accordion.getPanels();
	for (var i = 0; i < panels.length; i++)
	{
		var p = panels[i];
		var c = accordion.getPanelContent(p);
		if (c)
		{
			var h = c.offsetHeight;
			if (h == undefined)
				h = 0;

			if (p == panel && h == 0)
				c.style.display = "block";

			if (p == panel || h > 0)
			{
				var obj = new Object;
				obj.panel = p;
				obj.content = c;
				obj.fromHeight = h;
				obj.toHeight = (p == panel) ? (accordion.useFixedPanelHeights ? accordion.fixedPanelHeight : c.scrollHeight) : 0;
				obj.distance = obj.toHeight - obj.fromHeight;
				obj.overflow = c.style.overflow;
				this.panelData.push(obj);

				c.style.overflow = "hidden";
				c.style.height = h + "px";
			}
		}
	}
};

Spry.Widget.Accordion.PanelAnimator.defaultTransition = function(time, begin, finish, duration) { time /= duration; return begin + ((2 - time) * time * finish); };

Spry.Widget.Accordion.PanelAnimator.prototype.start = function()
{
	var self = this;
	this.startTime = (new Date).getTime();
	this.timer = setTimeout(function() { self.stepAnimation(); }, this.interval);
};

Spry.Widget.Accordion.PanelAnimator.prototype.stop = function()
{
	if (this.timer)
	{
		clearTimeout(this.timer);

		// If we're killing the timer, restore the overflow
		// properties on the panels we were animating!

		for (i = 0; i < this.panelData.length; i++)
		{
			obj = this.panelData[i];
			obj.content.style.overflow = obj.overflow;
		}
	}

	this.timer = null;
};

Spry.Widget.Accordion.PanelAnimator.prototype.stepAnimation = function()
{
	var curTime = (new Date).getTime();
	var elapsedTime = curTime - this.startTime;

	var i, obj;

	if (elapsedTime >= this.duration)
	{
		for (i = 0; i < this.panelData.length; i++)
		{
			obj = this.panelData[i];
			if (obj.panel != this.panel)
			{
				obj.content.style.display = "none";
				obj.content.style.height = "0px";
			}
			obj.content.style.overflow = obj.overflow;
			obj.content.style.height = (this.useFixedPanelHeights || obj.toHeight == 0) ? obj.toHeight + "px" : "auto";
		}
		if (this.onComplete)
			this.onComplete();
		return;
	}

	for (i = 0; i < this.panelData.length; i++)
	{
		obj = this.panelData[i];
		var ht = this.transition(elapsedTime, obj.fromHeight, obj.distance, this.duration);
		obj.content.style.height = ((ht < 0) ? 0 : ht) + "px";
	}
	
	var self = this;
	this.timer = setTimeout(function() { self.stepAnimation(); }, this.interval);
};

})(); // EndSpryComponent
;
// SpryCollapsiblePanel.js - version 0.8 - Spry Pre-Release 1.6.1
//
// Copyright (c) 2006. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

(function() { // BeginSpryComponent

if (typeof Spry == "undefined") window.Spry = {}; if (!Spry.Widget) Spry.Widget = {};

Spry.Widget.CollapsiblePanel = function(element, opts)
{
	this.element = this.getElement(element);
	this.focusElement = null;
	this.hoverClass = "CollapsiblePanelTabHover";
	this.openClass = "CollapsiblePanelOpen";
	this.closedClass = "CollapsiblePanelClosed";
	this.focusedClass = "CollapsiblePanelFocused";
	this.enableAnimation = true;
	this.enableKeyboardNavigation = true;
	this.animator = null;
	this.hasFocus = false;
	this.contentIsOpen = true;

	this.openPanelKeyCode = Spry.Widget.CollapsiblePanel.KEY_DOWN;
	this.closePanelKeyCode = Spry.Widget.CollapsiblePanel.KEY_UP;

	Spry.Widget.CollapsiblePanel.setOptions(this, opts);

	this.attachBehaviors();
};

Spry.Widget.CollapsiblePanel.prototype.getElement = function(ele)
{
	if (ele && typeof ele == "string")
		return document.getElementById(ele);
	return ele;
};

Spry.Widget.CollapsiblePanel.prototype.addClassName = function(ele, className)
{
	if (!ele || !className || (ele.className && ele.className.search(new RegExp("\\b" + className + "\\b")) != -1))
		return;
	ele.className += (ele.className ? " " : "") + className;
};

Spry.Widget.CollapsiblePanel.prototype.removeClassName = function(ele, className)
{
	if (!ele || !className || (ele.className && ele.className.search(new RegExp("\\b" + className + "\\b")) == -1))
		return;
	ele.className = ele.className.replace(new RegExp("\\s*\\b" + className + "\\b", "g"), "");
};

Spry.Widget.CollapsiblePanel.prototype.hasClassName = function(ele, className)
{
	if (!ele || !className || !ele.className || ele.className.search(new RegExp("\\b" + className + "\\b")) == -1)
		return false;
	return true;
};

Spry.Widget.CollapsiblePanel.prototype.setDisplay = function(ele, display)
{
	if( ele )
		ele.style.display = display;
};

Spry.Widget.CollapsiblePanel.setOptions = function(obj, optionsObj, ignoreUndefinedProps)
{
	if (!optionsObj)
		return;
	for (var optionName in optionsObj)
	{
		if (ignoreUndefinedProps && optionsObj[optionName] == undefined)
			continue;
		obj[optionName] = optionsObj[optionName];
	}
};

Spry.Widget.CollapsiblePanel.prototype.onTabMouseOver = function(e)
{
	this.addClassName(this.getTab(), this.hoverClass);
	return false;
};

Spry.Widget.CollapsiblePanel.prototype.onTabMouseOut = function(e)
{
	this.removeClassName(this.getTab(), this.hoverClass);
	return false;
};

Spry.Widget.CollapsiblePanel.prototype.open = function()
{
	this.contentIsOpen = true;
	if (this.enableAnimation)
	{
		if (this.animator)
			this.animator.stop();
		this.animator = new Spry.Widget.CollapsiblePanel.PanelAnimator(this, true, { duration: this.duration, fps: this.fps, transition: this.transition });
		this.animator.start();
	}
	else
		this.setDisplay(this.getContent(), "block");

	this.removeClassName(this.element, this.closedClass);
	this.addClassName(this.element, this.openClass);
};

Spry.Widget.CollapsiblePanel.prototype.close = function()
{
	this.contentIsOpen = false;
	if (this.enableAnimation)
	{
		if (this.animator)
			this.animator.stop();
		this.animator = new Spry.Widget.CollapsiblePanel.PanelAnimator(this, false, { duration: this.duration, fps: this.fps, transition: this.transition });
		this.animator.start();
	}
	else
		this.setDisplay(this.getContent(), "none");

	this.removeClassName(this.element, this.openClass);
	this.addClassName(this.element, this.closedClass);
};

Spry.Widget.CollapsiblePanel.prototype.onTabClick = function(e)
{
	if (this.isOpen())
		this.close();
	else
		this.open();

	this.focus();

	return this.stopPropagation(e);
};

Spry.Widget.CollapsiblePanel.prototype.onFocus = function(e)
{
	this.hasFocus = true;
	this.addClassName(this.element, this.focusedClass);
	return false;
};

Spry.Widget.CollapsiblePanel.prototype.onBlur = function(e)
{
	this.hasFocus = false;
	this.removeClassName(this.element, this.focusedClass);
	return false;
};

Spry.Widget.CollapsiblePanel.KEY_UP = 38;
Spry.Widget.CollapsiblePanel.KEY_DOWN = 40;

Spry.Widget.CollapsiblePanel.prototype.onKeyDown = function(e)
{
	var key = e.keyCode;
	if (!this.hasFocus || (key != this.openPanelKeyCode && key != this.closePanelKeyCode))
		return true;

	if (this.isOpen() && key == this.closePanelKeyCode)
		this.close();
	else if ( key == this.openPanelKeyCode)
		this.open();
	
	return this.stopPropagation(e);
};

Spry.Widget.CollapsiblePanel.prototype.stopPropagation = function(e)
{
	if (e.preventDefault) e.preventDefault();
	else e.returnValue = false;
	if (e.stopPropagation) e.stopPropagation();
	else e.cancelBubble = true;
	return false;
};

Spry.Widget.CollapsiblePanel.prototype.attachPanelHandlers = function()
{
	var tab = this.getTab();
	if (!tab)
		return;

	var self = this;
	Spry.Widget.CollapsiblePanel.addEventListener(tab, "click", function(e) { return self.onTabClick(e); }, false);
	Spry.Widget.CollapsiblePanel.addEventListener(tab, "mouseover", function(e) { return self.onTabMouseOver(e); }, false);
	Spry.Widget.CollapsiblePanel.addEventListener(tab, "mouseout", function(e) { return self.onTabMouseOut(e); }, false);

	if (this.enableKeyboardNavigation)
	{
		// XXX: IE doesn't allow the setting of tabindex dynamically. This means we can't
		// rely on adding the tabindex attribute if it is missing to enable keyboard navigation
		// by default.

		// Find the first element within the tab container that has a tabindex or the first
		// anchor tag.
		
		var tabIndexEle = null;
		var tabAnchorEle = null;

		this.preorderTraversal(tab, function(node) {
			if (node.nodeType == 1 /* NODE.ELEMENT_NODE */)
			{
				var tabIndexAttr = tab.attributes.getNamedItem("tabindex");
				if (tabIndexAttr)
				{
					tabIndexEle = node;
					return true;
				}
				if (!tabAnchorEle && node.nodeName.toLowerCase() == "a")
					tabAnchorEle = node;
			}
			return false;
		});

		if (tabIndexEle)
			this.focusElement = tabIndexEle;
		else if (tabAnchorEle)
			this.focusElement = tabAnchorEle;

		if (this.focusElement)
		{
			Spry.Widget.CollapsiblePanel.addEventListener(this.focusElement, "focus", function(e) { return self.onFocus(e); }, false);
			Spry.Widget.CollapsiblePanel.addEventListener(this.focusElement, "blur", function(e) { return self.onBlur(e); }, false);
			Spry.Widget.CollapsiblePanel.addEventListener(this.focusElement, "keydown", function(e) { return self.onKeyDown(e); }, false);
		}
	}
};

Spry.Widget.CollapsiblePanel.addEventListener = function(element, eventType, handler, capture)
{
	try
	{
		if (element.addEventListener)
			element.addEventListener(eventType, handler, capture);
		else if (element.attachEvent)
			element.attachEvent("on" + eventType, handler);
	}
	catch (e) {}
};

Spry.Widget.CollapsiblePanel.prototype.preorderTraversal = function(root, func)
{
	var stopTraversal = false;
	if (root)
	{
		stopTraversal = func(root);
		if (root.hasChildNodes())
		{
			var child = root.firstChild;
			while (!stopTraversal && child)
			{
				stopTraversal = this.preorderTraversal(child, func);
				try { child = child.nextSibling; } catch (e) { child = null; }
			}
		}
	}
	return stopTraversal;
};

Spry.Widget.CollapsiblePanel.prototype.attachBehaviors = function()
{
	var panel = this.element;
	var tab = this.getTab();
	var content = this.getContent();

	if (this.contentIsOpen || this.hasClassName(panel, this.openClass))
	{
		this.addClassName(panel, this.openClass);
		this.removeClassName(panel, this.closedClass);
		this.setDisplay(content, "block");
		this.contentIsOpen = true;
	}
	else
	{
		this.removeClassName(panel, this.openClass);
		this.addClassName(panel, this.closedClass);
		this.setDisplay(content, "none");
		this.contentIsOpen = false;
	}

	this.attachPanelHandlers();
};

Spry.Widget.CollapsiblePanel.prototype.getTab = function()
{
	return this.getElementChildren(this.element)[0];
};

Spry.Widget.CollapsiblePanel.prototype.getContent = function()
{
	return this.getElementChildren(this.element)[1];
};

Spry.Widget.CollapsiblePanel.prototype.isOpen = function()
{
	return this.contentIsOpen;
};

Spry.Widget.CollapsiblePanel.prototype.getElementChildren = function(element)
{
	var children = [];
	var child = element.firstChild;
	while (child)
	{
		if (child.nodeType == 1 /* Node.ELEMENT_NODE */)
			children.push(child);
		child = child.nextSibling;
	}
	return children;
};

Spry.Widget.CollapsiblePanel.prototype.focus = function()
{
	if (this.focusElement && this.focusElement.focus)
		this.focusElement.focus();
};

/////////////////////////////////////////////////////

Spry.Widget.CollapsiblePanel.PanelAnimator = function(panel, doOpen, opts)
{
	this.timer = null;
	this.interval = 0;

	this.fps = 60;
	this.duration = 500;
	this.startTime = 0;

	this.transition = Spry.Widget.CollapsiblePanel.PanelAnimator.defaultTransition;

	this.onComplete = null;

	this.panel = panel;
	this.content = panel.getContent();
	this.doOpen = doOpen;

	Spry.Widget.CollapsiblePanel.setOptions(this, opts, true);

	this.interval = Math.floor(1000 / this.fps);

	var c = this.content;

	var curHeight = c.offsetHeight ? c.offsetHeight : 0;
	this.fromHeight = (doOpen && c.style.display == "none") ? 0 : curHeight;

	if (!doOpen)
		this.toHeight = 0;
	else
	{
		if (c.style.display == "none")
		{
			// The content area is not displayed so in order to calculate the extent
			// of the content inside it, we have to set its display to block.

			c.style.visibility = "hidden";
			c.style.display = "block";
		}

		// Clear the height property so we can calculate
		// the full height of the content we are going to show.

		c.style.height = "";
		this.toHeight = c.offsetHeight;
	}

	this.distance = this.toHeight - this.fromHeight;
	this.overflow = c.style.overflow;

	c.style.height = this.fromHeight + "px";
	c.style.visibility = "visible";
	c.style.overflow = "hidden";
	c.style.display = "block";
};

Spry.Widget.CollapsiblePanel.PanelAnimator.defaultTransition = function(time, begin, finish, duration) { time /= duration; return begin + ((2 - time) * time * finish); };

Spry.Widget.CollapsiblePanel.PanelAnimator.prototype.start = function()
{
	var self = this;
	this.startTime = (new Date).getTime();
	this.timer = setTimeout(function() { self.stepAnimation(); }, this.interval);
};

Spry.Widget.CollapsiblePanel.PanelAnimator.prototype.stop = function()
{
	if (this.timer)
	{
		clearTimeout(this.timer);

		// If we're killing the timer, restore the overflow property.

		this.content.style.overflow = this.overflow;
	}

	this.timer = null;
};

Spry.Widget.CollapsiblePanel.PanelAnimator.prototype.stepAnimation = function()
{
	var curTime = (new Date).getTime();
	var elapsedTime = curTime - this.startTime;

	if (elapsedTime >= this.duration)
	{
		if (!this.doOpen)
			this.content.style.display = "none";
		this.content.style.overflow = this.overflow;
		this.content.style.height = this.toHeight + "px";
		if (this.onComplete)
			this.onComplete();
		return;
	}

	var ht = this.transition(elapsedTime, this.fromHeight, this.distance, this.duration);

	this.content.style.height = ((ht < 0) ? 0 : ht) + "px";

	var self = this;
	this.timer = setTimeout(function() { self.stepAnimation(); }, this.interval);
};

Spry.Widget.CollapsiblePanelGroup = function(element, opts)
{
	this.element = this.getElement(element);
	this.opts = opts;

	this.attachBehaviors();
};

Spry.Widget.CollapsiblePanelGroup.prototype.setOptions = Spry.Widget.CollapsiblePanel.prototype.setOptions;
Spry.Widget.CollapsiblePanelGroup.prototype.getElement = Spry.Widget.CollapsiblePanel.prototype.getElement;
Spry.Widget.CollapsiblePanelGroup.prototype.getElementChildren = Spry.Widget.CollapsiblePanel.prototype.getElementChildren;

Spry.Widget.CollapsiblePanelGroup.prototype.setElementWidget = function(element, widget)
{
	if (!element || !widget)
		return;
	if (!element.spry)
		element.spry = new Object;
	element.spry.collapsiblePanel = widget;
};

Spry.Widget.CollapsiblePanelGroup.prototype.getElementWidget = function(element)
{
	return (element && element.spry && element.spry.collapsiblePanel) ? element.spry.collapsiblePanel : null;
};

Spry.Widget.CollapsiblePanelGroup.prototype.getPanels = function()
{
	if (!this.element)
		return [];
	return this.getElementChildren(this.element);
};

Spry.Widget.CollapsiblePanelGroup.prototype.getPanel = function(panelIndex)
{
	return this.getPanels()[panelIndex];
};

Spry.Widget.CollapsiblePanelGroup.prototype.attachBehaviors = function()
{
	if (!this.element)
		return;

	var cpanels = this.getPanels();
	var numCPanels = cpanels.length;
	for (var i = 0; i < numCPanels; i++)
	{
		var cpanel = cpanels[i];
		this.setElementWidget(cpanel, new Spry.Widget.CollapsiblePanel(cpanel, this.opts));
	}
};

Spry.Widget.CollapsiblePanelGroup.prototype.openPanel = function(panelIndex)
{
	var w = this.getElementWidget(this.getPanel(panelIndex));
	if (w && !w.isOpen())
		w.open();
};

Spry.Widget.CollapsiblePanelGroup.prototype.closePanel = function(panelIndex)
{
	var w = this.getElementWidget(this.getPanel(panelIndex));
	if (w && w.isOpen())
		w.close();
};

Spry.Widget.CollapsiblePanelGroup.prototype.openAllPanels = function()
{
	var cpanels = this.getPanels();
	var numCPanels = cpanels.length;
	for (var i = 0; i < numCPanels; i++)
	{
		var w = this.getElementWidget(cpanels[i]);
		if (w && !w.isOpen())
			w.open();
	}
};

Spry.Widget.CollapsiblePanelGroup.prototype.closeAllPanels = function()
{
	var cpanels = this.getPanels();
	var numCPanels = cpanels.length;
	for (var i = 0; i < numCPanels; i++)
	{
		var w = this.getElementWidget(cpanels[i]);
		if (w && w.isOpen())
			w.close();
	}
};

})(); // EndSpryComponent
;
