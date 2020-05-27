// Copyright 2020, University of Colorado Boulder

/**
 * WolfGroup is the PhetioGroup for Wolf.  It manages dynamic instances of Wolf, as required by PhET-iO.
 * All Wolf instances are created and disposed via this group.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import PhetioGroupIO from '../../../../tandem/js/PhetioGroupIO.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import Wolf from './Wolf.js';
import WolfIO from './WolfIO.js';

class WolfGroup extends PhetioGroup {

  /**
   * @param {EnvironmentModelViewTransform} modelViewTransform
   * @param {Object} [options]
   */
  constructor( modelViewTransform, options ) {

    assert && assert( modelViewTransform instanceof EnvironmentModelViewTransform, 'invalid modelViewTransform' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: PhetioGroupIO( WolfIO ),
      phetioDocumentation: 'manages dynamic PhET-iO elements of type Wolf'
    }, options );

    /**
     * Called to instantiate a Wolf. Note that modelViewTransform is passed via closure, so we don't
     * have to create it as part of defaultArguments, and don't have to deal with serializing it in WolfIO.
     * @param {Tandem} tandem - PhetioGroup requires tandem to be the first param
     * @param {Object} wolfOptions - options to Wolf constructor, not actually optional, because createElement
     *                               must have a fixed number of args
     * @returns {Wolf}
     */
    const createElement = ( tandem, wolfOptions ) => {
      return new Wolf( modelViewTransform, merge( {}, wolfOptions, {
        tandem: tandem
      } ) );
    };

    // defaultArguments, passed to createElement during API harvest
    const defaultArguments = [ {} ];

    super( createElement, defaultArguments, options );
  }

  /**
   * Steps all wolves.
   * @param {number} dt - time step, in seconds
   */
  step( dt ) {
    this.forEach( wolf => wolf.step( dt ) );
  }
}

naturalSelection.register( 'WolfGroup', WolfGroup );
export default WolfGroup;