// Copyright 2020, University of Colorado Boulder

/**
 * NaturalSelectionScreen is the base class for all Screens in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen from '../../../joist/js/Screen.js';
import naturalSelection from '../naturalSelection.js';

class NaturalSelectionScreen extends Screen {

  /**
   * @param {function} createModel
   * @param {function:Object } createView - function( model )
   * @param {Object} [options]
   */
  constructor( createModel, createView, options ) {

    super( createModel, createView, options );

    // Log when the Screen becomes active
    phet.log && this.activeProperty.link( active => {
      if ( active ) {
        phet.log && phet.log( `>>>>>> ${this.nameProperty.value} screen is active` );
      }
    } );
  }
}

naturalSelection.register( 'NaturalSelectionScreen', NaturalSelectionScreen );
export default NaturalSelectionScreen;