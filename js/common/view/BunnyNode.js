// Copyright 2020, University of Colorado Boulder

/**
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
 define( require => {
   'use strict';

   // modules
   const Bunny = require( 'NATURAL_SELECTION/common/model/Bunny' );
   const Circle = require( 'SCENERY/nodes/Circle' );
   const EnvironmentModelViewTransform = require( 'NATURAL_SELECTION/common/model/EnvironmentModelViewTransform' );
   const Image = require( 'SCENERY/nodes/Image' );
   const merge = require( 'PHET_CORE/merge' );
   const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
   const Node = require( 'SCENERY/nodes/Node' );

   // images
   const bunnyWhiteFurStraightEarsShortTeethImage = require( 'image!NATURAL_SELECTION/bunny-whiteFur-straightEars-shortTeeth.png' );

   // constants
   const SCALE = 0.5; // scale applied in addition to modelViewTransform scale

   class BunnyNode extends Node {

     /**
      * @param {Bunny} bunny
      * @param {EnvironmentModelViewTransform} modelViewTransform
      * @param {Object} [options]
      */
     constructor( bunny, modelViewTransform, options ) {

       assert && assert( bunny instanceof Bunny, 'invalid bunny' );
       assert && assert( modelViewTransform instanceof EnvironmentModelViewTransform, 'invalid modelViewTransform' );

       options = merge( {
         showDeadBunny: false
       }, options );

       const image = new Image( bunnyWhiteFurStraightEarsShortTeethImage, {
         scale: modelViewTransform.getViewScale( bunny.positionProperty.value.z ),
         centerX: 0,
         bottom: 0
       } );

       assert && assert( !options.children, 'BunnyNode sets children' );
       options.children = [ image ];

       if ( phet.chipper.queryParameters.dev ) {

         // Red dot at the origin
         options.children.push( new Circle( 4, { fill: 'red' } ) );
       }

       super( options );

       // Position the bunny, and scale it based on depth.
       const positionObserver = position => {
         assert && assert( bunny.isAliveProperty.value, 'bunny is dead' );

         // position
         this.translation = modelViewTransform.modelToViewPosition( position );

         // scale and direction
         const scale = SCALE * modelViewTransform.getViewScale( position.z );
         const direction = bunny.movingRight ? 1 : -1; // bunny images point to right
         this.setScaleMagnitude( direction * scale, scale );
       };
       bunny.positionProperty.link( positionObserver );

       // Optionally hide the bunny when it dies. Dead bunnies are shown in the Pedigree graph.
       const isAliveObserver = isAlive => {
         this.visible = isAlive || options.showDeadBunny;
       };
       bunny.isAliveProperty.link( isAliveObserver );

       const disposedListener = () => {
         this.dispose();
       };
       bunny.disposedEmitter.addListener( disposedListener );

       // @private
       this.disposeBunnyNode = () => {
         bunny.positionProperty.unlink( positionObserver );
         bunny.isAliveProperty.unlink( isAliveObserver );
         bunny.disposedEmitter.removeListener( disposedListener );
       };
     }

     /**
      * @public
      * @override
      */
     dispose() {
       super.dispose();
       this.disposeBunnyNode();
     }
   }

   return naturalSelection.register( 'BunnyNode', BunnyNode );
 } );