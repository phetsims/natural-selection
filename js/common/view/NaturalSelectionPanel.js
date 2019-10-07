// Copyright 2019, University of Colorado Boulder

/**
 * NaturalSelectionPanel is a specialization of Panel that provides a more convenient API for creating a
 * fixed-width Panel.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const Panel = require( 'SUN/Panel' );

  class NaturalSelectionPanel extends Panel {

    /**
     * @param {Node} content
     * @param {Object} [options]
     */
    constructor( content, options ) {

      options = _.extend( {
        fixedWidth: null // {number|null} optional fixed width
      }, options );

      assert && assert( ( typeof options.fixedWidth === 'number' && options.fixedWidth > 0) || options.fixedWidth === null,
        `invalid fixedWidth: ${options.fixedWidth}` );

      if ( options.fixedWidth ) {
        assert && assert( typeof options.fixedWidth === 'number', `invalid fixedWidth: ${options.fixedWidth}` );

        assert && assert( options.minWidth === undefined, 'NaturalSelectionPanel sets minWidth' );
        assert && assert( options.maxWidth === undefined, 'NaturalSelectionPanel sets maxWidth' );
        options.minWidth = options.fixedWidth;
        options.maxWidth = options.fixedWidth;
      }

      super( content, options );
    }
  }

  return naturalSelection.register( 'NaturalSelectionPanel', NaturalSelectionPanel );
} );