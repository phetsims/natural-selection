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
   const Movable3Node = require( 'NATURAL_SELECTION/common/view/Movable3Node' );
   const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );

   // images
   const bunnyWhiteFurStraightEarsShortTeethImage = require( 'image!NATURAL_SELECTION/bunny-whiteFur-straightEars-shortTeeth.png' );

   // constants
   const SCALE = 0.5; // scale applied in addition to modelViewTransform scale

   class BunnyNode extends Movable3Node {

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

       super( bunny, options );

       // Position the bunny, and scale it based on depth.
       const bunnyPositionObserver = position => {
         assert && assert( bunny.isAliveProperty.value, 'bunny is dead' );

         // position
         this.translation = modelViewTransform.modelToViewPosition( position );

         // scale
         this.setScaleMagnitude( SCALE * modelViewTransform.getViewScale( position.z ) );
       };
       bunny.positionProperty.link( bunnyPositionObserver );

       // Direction the bunny is facing
       const bunnyDirectionObserver = isMovingRight => {
         const getScaleVector = this.getScaleVector();
         const xScale = isMovingRight ? getScaleVector.x : -getScaleVector.x;
         this.setScaleMagnitude( xScale, getScaleVector.y );
       };
       bunny.isMovingRightProperty.link( bunnyDirectionObserver );

       // Optionally hide the bunny when it dies. Dead bunnies are shown in the Pedigree graph.
       const bunnyIsAliveObserver = isAlive => {
         this.visible = isAlive || options.showDeadBunny;
       };
       bunny.isAliveProperty.link( bunnyIsAliveObserver );

       // Dispose this node when its associated bunny is disposed.
       const bunnyDisposedListener = () => {
         this.dispose();
       };
       bunny.disposedEmitter.addListener( bunnyDisposedListener );

       // @private
       this.disposeBunnyNode = () => {
         bunny.positionProperty.unlink( bunnyPositionObserver );
         bunny.isMovingRightProperty.unlink( bunnyDirectionObserver );
         bunny.isAliveProperty.unlink( bunnyIsAliveObserver );
         bunny.disposedEmitter.removeListener( bunnyDisposedListener );
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