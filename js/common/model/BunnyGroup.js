// Copyright 2020, University of Colorado Boulder

/**
 * BunnyGroup is the PhetioGroup for Bunny.  It manages dynamic instances of Bunny.
 * All Bunny instances are created and disposed via this group.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import PhetioGroupIO from '../../../../tandem/js/PhetioGroupIO.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import Bunny from './Bunny.js';
import BunnyIO from './BunnyIO.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';

class BunnyGroup extends PhetioGroup {

  /**
   * @param {EnvironmentModelViewTransform} modelViewTransform
   * @param {Object} [options]
   */
  constructor( modelViewTransform, options ) {

    assert && assert( modelViewTransform instanceof EnvironmentModelViewTransform, 'invalid modelViewTransform' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: PhetioGroupIO( BunnyIO ),
      phetioDocumentation: 'TODO'
    }, options );

    /**
     * Called to instantiate a Bunny. Note that modelViewTransform is passed via closure, so we don't have to create
     * it as part of defaultArguments, and don't have to deal with serializing it in BunnyIO.
     * @param {Tandem} tandem - PhetioGroup requires tandem to be the first param
     * @param {Object} [options]
     * @returns {Bunny}
     */
    const createMember = ( tandem, options ) => {
      return new Bunny( modelViewTransform, merge( {}, options, {
        tandem: tandem
      } ) );
    };

    // defaultArguments, passed to createMember during API harvest (when running 'grunt update').
    // Note that its necessary to include {} for options.
    const defaultArguments = [ {} ];

    super( createMember, defaultArguments, options );
  }
}

naturalSelection.register( 'BunnyGroup', BunnyGroup );
export default BunnyGroup;