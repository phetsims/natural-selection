// Copyright 2019, University of Colorado Boulder

/**
 * MutationIconNode is the mutation icon that appears in the Pedigree tree and 'Add Mutations' panel.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );

  // strings
  const mutationIconImage = require( 'image!NATURAL_SELECTION/mutationIcon.png' );

  class MutationIconNode extends Image {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = merge( {
        scale: 0.25
      }, options );

      super( mutationIconImage, options );
    }
  }

  return naturalSelection.register( 'MutationIconNode', MutationIconNode );
} );