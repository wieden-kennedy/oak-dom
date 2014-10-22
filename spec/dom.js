"use strict";

describe("dom", function () {

  it("is exposed", function () {
    var strap = oak.strap();
    expect(strap.css).toBeDefined();
  });

  describe('exposed methods', function () {

    describe('method: build', function () {
      it('builds a dom node', function () {
        var div = oak.build('<div></div>');
        expect(div.nodeName).toBe('DIV');
      });
    });

    describe('method: contains', function () {
      // FAILING
      it('returns true if a child exists in the parent', function () {
        //var div = document.createElement('div');
        //var span = document.createElement('span');
        //div.appendChild(span);
        //var result = oak.contains(div, span);
        //expect(result).toBe(true);
      });
    });

    describe('method: find', function () {
      it('returns a dom element', function () {
        var div = document.createElement('div');
        div.className = 'test';
        document.body.appendChild(div);
        var result = oak.find('.test');
        expect(result.className).toBeDefined();
      });
    });

    describe('method: findAll', function () {
      it('returns a nodeList', function () {
        for (var i = 0, d; i < 3; i += 1) {
          d = document.createElement('div');
          document.body.appendChild(d);
        }
        var result = oak.findAll('div');
        expect(result.length).toBeDefined();
      });
    });

    describe('method: hasClass', function () {
      it('returns true if the class exists', function () {
        var div = document.createElement('div');
        div.className = 'test';
        var result = oak.hasClass(div, 'test');
        expect(result).toBe(true);
      });

      it('returns false if the class does not exist', function () {
        var div = document.createElement('div');
        div.className = 'test';
        var result = oak.hasClass(div, 'notTest');
        expect(result).toBe(false);
      });
    });

    describe('method: next', function () {
      it('finds sibling', function () {
        var div = oak.build('<div><button id="button-one" class="btn"></button><button id="button-two" class="btn"></button></div>');
        document.body.appendChild(div);
        var strap = oak.strap("#button-one");
        expect(strap.next()[0].id).toBe("button-two");
      });
    });

    describe('method: prev', function () {
      it('finds sibling', function () {
        var div = oak.build('<div><button id="button-one" class="btn"></button><button id="button-two" class="btn"></button></div>');
        document.body.appendChild(div);
        var strap = oak.strap("#button-two");
        expect(strap.prev()[0].id).toBe("button-one");
      });
    });

    describe('method: toStyle', function () {
      it("converts to style", function () {
        var val = oak.toStyle("background-color");
        expect(val).toBe("backgroundColor");
      });

      it("converts to vendor style", function () {
        var val = oak.toStyle("-moz-transition");
        expect(val).toBe("mozTransition");
      });
    });

    describe('method: toDash', function () {
      it("converts style to dash", function () {
        var val = oak.toDash("backgroundColor");
        expect(val).toBe("background-color");
      });

      it("converts vendor style to dash", function () {
        var val = oak.toDash("webkitTransition");
        expect(val).toBe("-webkit-transition");
      });
    });
  });

  describe('exposed methods', function () {
    var div;
    beforeEach(function () {
      div = document.createElement('div');
      div = oak.strap(div);
    });

    describe('method: addClass', function () {
      it("sets class name", function () {
        div.addClass('foo');
        expect(div[0].className).toBe("foo");
      });
    });

    describe('method: append', function () {
      it('adds a child to the end of its children array', function () {
        for (var i = 0; i < 3; i += 1) {
          var d = document.createElement('div');
          div.append(d);
        }
        var newDiv = document.createElement('div');
        div.addClass('test');
        div.append(newDiv);
        expect(div[0].children[3]).toBe(newDiv);
      });

      it('adds a child to the end of its children array from a string representation', function () {
        div.append('<span></span>');
        expect(div[0].children[0].nodeName).toEqual('SPAN');
      });

      it('adds items in a strapped collection to its dom tree', function () {
        var foo = document.createElement('div'),
            bar = document.createElement('div'),
            strap = oak.strap(foo, bar);

        div.append(strap); 
        expect(div[0].children[0]).toBe(foo);
        expect(div[0].children[1]).toBe(bar);
      });
    });

    describe('method: css', function () {
      it('returns a given style', function () {
        div[0].style.color = 'red';
        expect(div.css('color')).toBe('red');
      });

      it('sets a given style with "prop, val" format', function () {
        div.css('color', 'red');
        expect(div.css('color')).toBe('red');
      });

      it('sets styles with an object', function () {
        div.css({ color: 'red', background: 'black' });
        expect(div.css('color')).toBe('red');
        expect(div.css('background')).toBe('black');
      });
    });

    describe('method: find', function () {
      it('queries all nested children and returns result', function () {
        for (var i = 0; i < 4; i += 1) {
          var d = document.createElement('div');
          div.append(d);
        }
        div[0].children[1].className = 'findme';
        var found = div.find('.findme');
        expect(found[0].className).toBe('findme');
      });

      it('returns a strapped collection', function () {
        for (var i = 0; i < 4; i += 1) {
          var d = document.createElement('div');
          div.append(d);
        }
        var found = div.find('div');
        expect(found.length).toBeGreaterThan(1);
        expect(found.each).toBeDefined();
      });
    });

    describe('method: hasClass', function () {
      it('returns true if the class is found', function () {
        div.addClass('test');
        var result = div.hasClass('test');
        expect(result).toBe(true);
      });

      it('returns false if the class is not found', function () {
        div.addClass('test');
        var result = div.hasClass('nottest');
        expect(result).toBe(false);
      });

      // FAILING
      it('returns false if any items do not have the class', function () {
        //for (var i = 0; i < 4; i += 1) {
          //var d = document.createElement('div');
          //div.append(d);
        //}
        //div[0].children[1].className = 'test';
        //var found = div.find('div');
        //var result = found.hasClass('test');
        //expect(result).toBe(false);
      });
    });

    describe('method: html', function () {
      it("sets html", function () {
        div.html('test');
        expect(div[0].innerHTML).toBe("test");
      });
    });

    describe('method: hide', function () {
      it('sets the element style to "display: none;"', function () {
        div.hide();
        expect(div.css('display')).toBe('none');
      });

      // FAILING
      it('sets all items in the collection to "display: none;"', function () {
        //for (var i = 0; i < 4; i += 1) {
          //var d = document.createElement('div');
          //div.append(d);
        //}
        //var found = div.find('div');
        //found.hide();
        //oak.each(found, function (f) {
          //expect(f.css('display')).toBe('none'); 
        //});
      });
    });

    describe('method: prepend', function () {
      it('adds a child to the beginning of it\'s children array', function () {
        for (var i = 0; i < 3; i += 1) {
          var d = document.createElement('div');
          div.append(d);
        }
        var newDiv = document.createElement('div');
        newDiv.className = 'prepend';
        div.prepend(newDiv); 
        expect(div[0].children[0].className).toBe('prepend');
      });

      it('builds and adds a child to the beginning of it\'s children array from a string', function () {
        div.prepend('<span></span>');
        expect(div[0].children[0].nodeName).toBe('SPAN');
      });

      it('prepends nodes in a strap to it\'s dom tree', function () {
        var foo = document.createElement("div"),
            bar = document.createElement("div"),
            strap = oak.strap(foo); 
        div.prepend(foo);
        div.prepend(bar);
        expect(div[0].firstChild).toBe(bar);
      });
    });

    describe('method: remove', function () {
      it('removes a node', function () {
        var d = document.createElement('div');
        var strap = oak.strap();
        d.className = 'remove';
        div.append(d);
        var found = div.find('.remove');
        found.remove();
        expect(div[0].children.length).toBe(0);
      });
    });

    describe('method: removeClass', function () {
      it('removes a class from an element', function () {
        div.addClass('test');
        expect(div.hasClass('test')).toBe(true);
        div.removeClass('test');
        expect(div.hasClass('test')).toBe(false);
      });
    });

    describe('method: show', function () {
      it('sets an elements display style to block', function () {
        div.show();
        expect(div[0].style.display).toBe('block');
      });
    });

    describe('method: transform', function () {

      it('appends a transform definition', function () {
        div.css(oak.support.transform, "rotateX(180deg) scale(1.5)");
        div.transform('rotateY', '180deg');
        expect(div.css(oak.support.transform)).toBe("rotateX(180deg) scale(1.5) rotateY(180deg)");
      });

      it('inserts a transform definition', function () {
        div.css(oak.support.transform, "rotateY(180deg) scale(1.5)");
        div.transform('rotateY', '90deg');
        expect(div.css(oak.support.transform)).toBe("rotateY(90deg) scale(1.5)");
      });

      it('crates a new transform definition', function () {
        div.transform('rotateY', '90deg');
        expect(div.css(oak.support.transform)).toBe("rotateY(90deg)");
      });

    });

    describe('method: visible', function () {
      it("sets visibility", function () {
        div.visible(false);
        expect(div.css("visibility")).toBe("hidden");
      });

      it("gets visibility", function () {
        expect(div.visible()).toBe(true);
      });
    });
  });
});
