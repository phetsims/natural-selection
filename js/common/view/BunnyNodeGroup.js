// Copyright 2020, University of Colorado Boulder

/**
 * BunnyNodeGroup is the PhetioGroup for BunnyNode.  It manages dynamic instances of BunnyNode.
 * All BunnyNode instances are created and disposed via this group.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import PhetioGroupIO from '../../../../tandem/js/PhetioGroupIO.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import BunnyGroup from '../model/BunnyGroup.js';
import BunnyNode from './BunnyNode.js';
import BunnyNodeIO from './BunnyNodeIO.js';

//TODO https://github.com/phetsims/tandem/issues/158 rename to BunnyNodeReferenceIO ?
class BunnyNodeGroup extends PhetioGroup {

  /**
   * @param {BunnyGroup} bunnyGroup
   * @param {Property.<Bunny>} selectedBunnyProperty
   * @param {Object} [options]
   */
  constructor( bunnyGroup, selectedBunnyProperty, options ) {

    assert && assert( bunnyGroup instanceof BunnyGroup, 'invalid bunnyGroup' );
    assert && assert( selectedBunnyProperty instanceof Property, 'invalid selectedBunnyProperty' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: PhetioGroupIO( BunnyNodeIO ),
      phetioState: false,
      phetioDocumentation: 'TODO'
    }, options );

    /**
     * Called to instantiate a BunnyNode.
     * @param {Tandem} tandem - PhetioGroup requires tandem to be the first param
     * @param {Bunny} bunny
     * @returns {Bunny}
     */
    const createElement = ( tandem, bunny ) => {
      return new BunnyNode( bunny, selectedBunnyProperty, {
        tandem: tandem
      } );
    };

    // defaultArguments, passed to createElement during API harvest (when running 'grunt generate-phet-io-api-files').
    // Note that bunnyGroup.archetype is null except during API harvest.
    const defaultArguments = [ bunnyGroup.archetype ];

    super( createElement, defaultArguments, options );
  }
}

naturalSelection.register( 'BunnyNodeGroup', BunnyNodeGroup );
export default BunnyNodeGroup;