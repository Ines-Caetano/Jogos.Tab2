const fragment_shader4=`			uniform float time;
			varying vec2 vUv;
			void main( void ) {
				vec2 position = - 1.0 + 2.0 * vUv;
				float red = abs( sin( position.x * position.y + time / 5.0 ) );
				float green = abs( sin( position.x * position.y + time / 4.0 ) );
				float blue = abs( sin( position.x * position.y + time / 3.0 ) );
				gl_FragColor = vec4( red, green, blue, 1.0 );
			} `;
			
const fragment_shader3=`			uniform float time;
			varying vec2 vUv;
			void main( void ) {
				vec2 position = vUv;
				float color = 0.0;
				color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
				color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
				color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
				color *= sin( time / 10.0 ) * 0.5;
				gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
			}`;

const fragment_shader2=`			uniform float time;
			uniform sampler2D texture;
			varying vec2 vUv;
			void main( void ) {
				vec2 position = - 1.0 + 2.0 * vUv;
				float a = atan( position.y, position.x );
				float r = sqrt( dot( position, position ) );
				vec2 uv;
				uv.x = cos( a ) / r;
				uv.y = sin( a ) / r;
				uv /= 10.0;
				uv += time * 0.05;
				vec3 color = texture2D( texture, uv ).rgb;
				gl_FragColor = vec4( color * r * 1.5, 1.0 );
			}`;

const fragment_shader1=`			uniform float time;
			varying vec2 vUv;
			void main(void) {
				vec2 p = - 1.0 + 2.0 * vUv;
				float a = time * 40.0;
				float d, e, f, g = 1.0 / 40.0 ,h ,i ,r ,q;
				e = 400.0 * ( p.x * 0.5 + 0.5 );
				f = 400.0 * ( p.y * 0.5 + 0.5 );
				i = 200.0 + sin( e * g + a / 150.0 ) * 20.0;
				d = 200.0 + cos( f * g / 2.0 ) * 18.0 + cos( e * g ) * 7.0;
				r = sqrt( pow( abs( i - e ), 2.0 ) + pow( abs( d - f ), 2.0 ) );
				q = f / r;
				e = ( r * cos( q ) ) - a / 2.0;
				f = ( r * sin( q ) ) - a / 2.0;
				d = sin( e * g ) * 176.0 + sin( e * g ) * 164.0 + r;
				h = ( ( f + d ) + a / 2.0 ) * g;
				i = cos( h + r * p.x / 1.3 ) * ( e + e + a ) + cos( q * g * 6.0 ) * ( r + h / 3.0 );
				h = sin( f * g ) * 144.0 - sin( e * g ) * 212.0 * p.x;
				h = ( h + ( f - e ) * q + sin( r - ( a + h ) / 7.0 ) * 10.0 + i / 4.0 ) * g;
				i += cos( h * 2.3 * sin( a / 350.0 - q ) ) * 184.0 * sin( q - ( r * 4.3 + a / 12.0 ) * g ) + tan( r * g + h ) * 184.0 * cos( r * g + h );
				i = mod( i / 5.6, 256.0 ) / 64.0;
				if ( i < 0.0 ) i += 4.0;
				if ( i >= 2.0 ) i = 4.0 - i;
				d = r / 350.0;
				d += sin( d * d * 8.0 ) * 0.52;
				f = ( sin( a * g ) + 1.0 ) / 2.0;
				gl_FragColor = vec4( vec3( f * i / 1.6, i / 2.0 + d / 13.0, i ) * d * p.x + vec3( i / 1.3 + d / 8.0, i / 2.0 + d / 18.0, i ) * d * ( 1.0 - p.x ), 1.0 );
			}`;
			
const vertex_shader=`varying vec2 vUv;
			void main()
			{
				vUv = uv;
				vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
				gl_Position = projectionMatrix * mvPosition;
			}`;
			
	
	
	'use strict';
	
	Physijs.scripts.worker = '../physijs_worker.js';
	Physijs.scripts.ammo = 'ficheiros_do_jogo/js/ammo.js';
	
	var initScene, initEventHandling, render, criarTorre, criarRect, loader,
		renderer, scene, dir_light, am_light, camera,
		mesa, rectan = [],  mesa_material, cubo_material, intersect_plane, cone, rect, 
		rect_selecionado = null, mouse_position = new THREE.Vector3, rect_offset = new THREE.Vector3, _i, _v3 = new THREE.Vector3;
		var uniforme;
	
	
		var initScene, render, NoiseGen, loader,
		renderer, render_stats, physics_stats, scene, light, chao, chao_geometry, chao_material, camera;
	
	
	/**/
	

	/**/
	
	initScene = function() {
		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.shadowMap.enabled = true;
		renderer.shadowMapSoft = true;
		document.getElementById( 'viewport' ).appendChild( renderer.domElement );
		
		/*SHADER*/

		/*SHADER*/
		//uso da biblioteca Physijs 
		scene = new Physijs.Scene({ fixedTimeStep: 1 / 120 });
		scene.setGravity(new THREE.Vector3( 0, -30, 0 ));
		scene.addEventListener(
			'update',
			function() {
				if ( rect_selecionado !== null ) {
					
					_v3.copy( mouse_position ).add( rect_offset ).sub( rect_selecionado.position ).multiplyScalar( 5 );
					_v3.y = 0;
					rect_selecionado.setLinearVelocity( _v3 );
					
					// Reactivate all of the cubos
					_v3.set( 0, 0, 0 );
					for ( _i = 0; _i < rectan.length; _i++ ) {
						rectan[_i].applyCentralImpulse( _v3 );
					}
				}
				scene.simulate( undefined, 1 );
				
			}
		);
		
		camera = new THREE.PerspectiveCamera(
			35,
			window.innerWidth / window.innerHeight,
			1,
			1000
		);
		camera.position.set( 40, 10, 40 );
		camera.lookAt(new THREE.Vector3( 0, 7, 0 ));
		scene.add( camera );
		
		// ambient light
		am_light = new THREE.AmbientLight( 0x444444 );
		scene.add( am_light );

		// directional light
		dir_light = new THREE.DirectionalLight( 0xFFFFFF );
		dir_light.position.set( 20, 30, -5 );
		dir_light.target.position.copy( scene.position );
		dir_light.castShadow = true;
		dir_light.shadowCameraLeft = -30;
		dir_light.shadowCameraTop = -30;
		dir_light.shadowCameraRight = 30;
		dir_light.shadowCameraBottom = 30;
		dir_light.shadowCameraNear = 20;
		dir_light.shadowCameraFar = 200;
		dir_light.shadowBias = -.001
		dir_light.shadowMapWidth = dir_light.shadowMapHeight = 2048;
		dir_light.shadowDarkness = .5;
		scene.add( dir_light );

		// Loader
		loader = new THREE.TextureLoader();

		
		// Materials
		mesa_material = Physijs.createMaterial(
			new THREE.MeshLambertMaterial({ map: loader.load( 'imagens/color.jpg' )}),
			.9, // high friction
			.2 // low restitution
		);
		mesa_material.map.wrapS = mesa_material.map.wrapT = THREE.RepeatWrapping;
		mesa_material.map.repeat.set( 5, 5 );
		
		
		
	     cubo_material = Physijs.createMaterial(
			new THREE.MeshLambertMaterial({ map: loader.load( 'imagens/rocks.jpg' )}),
			.4,
			.4
		);
		
		cubo_material.map.wrapS = cubo_material.map.wrapT = THREE.RepeatWrapping;
		cubo_material.map.repeat.set( 5, 5 );

		cone_material = Physijs.createMaterial(
			new THREE.MeshLambertMaterial({map: loader.load('imagens/color.jpg')}),
			.4,
			.2
		);

		cone_material.map.wrapS = cone_material.map.wrapT = THREE.RepeatWrapping;
		cone_material.map.repeat.set(5,5);

		rect_material = Physijs.createMaterial(
			new THREE.MeshLambertMaterial({map: loader.load('imagens/wood.jpg')}),
			.9,
			.2
		);
		rect_material.map.wrapS = rect_material.map.wrapT = THREE.RepeatWrapping;
		rect_material.map.repeat.set(5,5);
		
			
		NoiseGen = new SimplexNoise;
		
		chao_geometry = new THREE.PlaneGeometry( 75, 75, 50, 50 );
		for ( var i = 0; i < chao_geometry.vertices.length; i++ ) {
			var vertex = chao_geometry.vertices[i];
			vertex.z = NoiseGen.noise( vertex.x / 20, vertex.y / 20 ) * 0;
		}
		chao_geometry.computeFaceNormals();
		chao_geometry.computeVertexNormals();
		// chao
		NoiseGen = new SimplexNoise;
		
		chao_geometry = new THREE.PlaneGeometry( 75, 75, 50, 50 );
		for ( var i = 0; i < chao_geometry.vertices.length; i++ ) {
			var vertex = chao_geometry.vertices[i];
			vertex.z = NoiseGen.noise( vertex.x / 50, vertex.y / 50 ) * 0;
			
		}
		chao_geometry.computeFaceNormals();
		chao_geometry.computeVertexNormals();
		// If your plane is not square as far as face count then the HeightfieldMesh
		// takes two more arguments at the end: # of x faces and # of y faces that were passed to THREE.PlaneMaterial
		chao = new Physijs.HeightfieldMesh(
			chao_geometry,
			mesa_material,
			0, // mass
			50,
			50
		);
		chao.rotation.x = Math.PI / -2;
		chao.receiveShadow = true;
		scene.add( chao );
		
			intersect_plane = new THREE.Mesh(
			new THREE.PlaneGeometry( 150, 150 ),
			new THREE.MeshBasicMaterial({ opacity: 0, transparent: true })
		);
		intersect_plane.rotation.x = Math.PI / -2;
		scene.add( intersect_plane );

		cone_geometry = new THREE.CylinderGeometry( 0, 2, 4, 32 );
		cone = new Physijs.ConeMesh( cone_geometry, cone_material );
		cone.position.y = (4 / 2) + 4 * 4;
		cone.position.x = 1 * 1 - ( 1 * 1 / 2 - 1 / 2 );
		cone.position.z = 1 * 1 - ( 1 * 1 / 2 - 1 / 2 );
		scene.add(cone);


		initEventHandling();
		
		requestAnimationFrame( render );
		scene.simulate();
		
		criarRect();
		criarTorre();
	};
		
		
	
	render = function() {
		requestAnimationFrame( render );
		renderer.render( scene, camera );
				
	};
	
criarRect = (function() {

	var rect_offset = 1;
 	rect_geometry = new THREE.BoxGeometry(8, 2, 2);

 	return function(){
 		var rect;

 		rect = new Physijs.BoxMesh(rect_geometry, rect_material);
		rect.position.y = 2;
		rect.position.x = 20;
		rect.position.z = 10;

		rect.receiveShadow = true;
		rect.castShadow = true;
		scene.add(rect);
		rectan.push(rect);

 	}


})();

criarTorre = (function() {
		var cubo_length = 4, cubo_height = 4, cubo_width = 4, cubo_offset = 1,
			cubo_geometry = new THREE.BoxGeometry( cubo_length, cubo_height, cubo_width );
		
		return function() {
			var i, j, rows = 4,
				cubo;
			
			for ( i = 0; i < rows; i++ ) {
				for ( j = 0; j < 1; j++ ) {
					cubo = new Physijs.BoxMesh( cubo_geometry, cubo_material );
					cubo.position.y = (cubo_height / 2) + cubo_height * i;
					cubo.position.x = cubo_offset * j - ( cubo_offset * 1 / 2 - cubo_offset / 2 );
					cubo.position.z = cubo_offset * j - ( cubo_offset * 1 / 2 - cubo_offset / 2 );
					
					cubo.receiveShadow = true;
					cubo.castShadow = true;
					scene.add( cubo );
				}
			}
		}
	})();
	
	initEventHandling = (function() {
		var _vector = new THREE.Vector3,
			handleMouseDown, handleMouseMove, handleMouseUp;
		
		handleMouseDown = function( evt ) {
			var ray, intersections;
			
			_vector.set(
				( evt.clientX / window.innerWidth ) * 2 - 1,
				-( evt.clientY / window.innerHeight ) * 2 + 1,
				1
			);

			_vector.unproject( camera );
			
			ray = new THREE.Raycaster( camera.position, _vector.sub( camera.position ).normalize() );
			intersections = ray.intersectObjects( rectan );

			if ( intersections.length > 0 ) {
				rect_selecionado = intersections[0].object;
				
				_vector.set( 0, 0, 0 );
				rect_selecionado.setAngularFactor( _vector );
				rect_selecionado.setAngularVelocity( _vector );
				rect_selecionado.setLinearFactor( _vector );
				rect_selecionado.setLinearVelocity( _vector );

				mouse_position.copy( intersections[0].point );
				rect_offset.subVectors( rect.position, mouse_position );
				
				intersect_plane.position.y = mouse_position.y;
			}
		};
		
		handleMouseMove = function( evt ) {
			
			var ray, intersection,
				i, scalar;
			
			if ( rect_selecionado !== null ) {
				
				_vector.set(
					( evt.clientX / window.innerWidth ) * 2 - 1,
					-( evt.clientY / window.innerHeight ) * 2 + 1,
					1
				);
				_vector.unproject( camera );
				
				ray = new THREE.Raycaster( camera.position, _vector.sub( camera.position ).normalize() );
				intersection = ray.intersectObject( intersect_plane );
				mouse_position.copy( intersection[0].point );
			}
			
		};
		
		handleMouseUp = function( evt ) {
			
			if ( rect_selecionado !== null ) {
				_vector.set( 1, 1, 1 );
				rect_selecionado.setAngularFactor( _vector );
				rect_selecionado.setLinearFactor( _vector );
				
				rect_selecionado = null;
			}
			
		};
		
		return function() {
			renderer.domElement.addEventListener( 'mousedown', handleMouseDown );
			renderer.domElement.addEventListener( 'mousemove', handleMouseMove );
			renderer.domElement.addEventListener( 'mouseup', handleMouseUp );
		};
	})();
	
	window.onload = initScene;
	