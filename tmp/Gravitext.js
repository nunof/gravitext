// ******************************************************************************
// @licstart
// The following is the entire license notice for the JavaScript code in this page.
//
//  Gravitext.js
//  Copyright (C) 2017  Nuno Ferreira - self@nunof.eu
//
//  The JavaScript code in this page is free software: you can
//  redistribute it and/or modify it under the terms of the GNU
//  General Public License (GNU GPL) as published by the Free Software
//  Foundation, either version 3 of the License, or (at your option)
//  any later version.  The code is distributed WITHOUT ANY WARRANTY;
//  without even the implied warranty of MERCHANTABILITY or FITNESS
//  FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
//
//  As additional permission under GNU GPL version 3 section 7, you
//  may distribute non-source (e.g., minimized or compacted) forms of
//  that code without the copy of the GNU GPL normally required by
//  section 4, provided you include this license notice and a URL
//  through which recipients can access the Corresponding Source.
//
// @licend
// The above is the entire license notice for the JavaScript code in this page.
//
// ******************************************************************************
//
//

function my_require( url ) {
    var ajax = new XMLHttpRequest();
    ajax.open( 'GET', url, false ); // <-- the 'false' makes it synchronous
    ajax.onreadystatechange = function () {
        var script = ajax.response || ajax.responseText;
        if (ajax.readyState === 4) {
            switch( ajax.status) {
                case 200:
                    eval.apply( window, [script] );
                    //console.log("script loaded: ", url);
                    ready_to_go();
                    break;
                default:
                    console.log("ERROR: script not loaded: ", url);
            }
        }
    };
    ajax.send(null);
}

my_require('matter.min.js');

function ready_to_go() { console.log("game on"); }

function Gravitext(canvas_elm) {

	// Private vars
  var Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Composites = Matter.Composites,
      Common = Matter.Common,
      MouseConstraint = Matter.MouseConstraint,
      Mouse = Matter.Mouse,
      World = Matter.World,
      Bodies = Matter.Bodies;

      var engine;
      var world;
    var render;
    var runner;

	var DEBUG = false;

	//Internal global vars serving as private storage for properties
	var _cnv_elm;
	typeof canvas_elm === 'undefined' ? _cnv_elm = null : _cnv_elm = canvas_elm;

	//Public properties
	Object.defineProperty(Gravitext.prototype, "canvas_elm", {
		configurable: true,
		get: function() {
			return _cnv_elm;
		},
		set: function(newval) {
			_cnv_elm = newval;
		}
	});

	//Public method for stopping everything

  Gravitext.prototype.world_bigbang = function() {

    // create engine
    engine = Engine.create();
    world = engine.world;



    // create renderer
    render = Render.create({
        element: _cnv_elm,
        engine: engine,
        options: {
            width: Math.min(_cnv_elm.clientWidth, 800),
            height: Math.min(_cnv_elm.clientHeight, 600),
            background: '#e6e6ff',
            showAngleIndicator: false,
            wireframes: false
        }
    });

    Render.run(render);

    // create runner
    runner = Runner.create();
    Runner.run(runner, engine);


    world.bodies = [];
    world_reset();


  }

  Gravitext.prototype.add_phrase = function(phrase) {
    var parts = phrase.split('');

    var stack = Composites.stack(20, 20, parts.length, 1, 0, 0, function(x, y, c) {
        var one = parts[c];
        var letter_number = /^[0-9a-zA-Z]+$/;
        one.match(letter_number) ? fchar = 'chars/24/'+one+'.png' : fchar = 'chars/24/p1.png';
        if (Common.random() > 0.35) {
          return Bodies.rectangle(x, y, 24, 24, {
            stokeStyle: "#ffffff",
            render: { sprite: { texture: fchar } }
          });
        }
        else {
          return Bodies.circle(x, y, 12, {
            density: 0.0005,
            frictionAir: 0.06,
            restitution: 0.3,
            friction: 0.001,
            render: { sprite: { texture: fchar } }
          });
        }
    });
    World.add(world, stack);
   }

  Gravitext.prototype.all_clear = function() {
    world_reset();
  }


  // ------------------------------------------------------Private Methods ----------------------------------------------

  function world_reset() {
    // add bodies
    var offset = 10,
        options = {
            isStatic: true
        };

    World.clear(world);
    World.add(world, [
        Bodies.rectangle(400, 600 + offset, 800.5 + 2 * offset, 50.5, options),
        Bodies.rectangle(800 + offset, 300, 50.5, 600.5 + 2 * offset, options),
        Bodies.rectangle(-offset, 300, 50.5, 600.5 + 2 * offset, options)
    ]);
    World.add(world, [
        Bodies.rectangle(200, 250, 400, 10, { isStatic: true, angle: Math.PI * 0.15 }),
        Bodies.rectangle(500, 450, 450, 10, { isStatic: true, angle: -Math.PI * 0.15 }),
        //Bodies.rectangle(300, 560, 600, 20, { isStatic: true, angle: Math.PI * 0.04 })
    ]);
    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

    World.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: 800, y: 600 }
    });

  }

}
