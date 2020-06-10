// Copyright 2020, University of Colorado Boulder

/**
 * EnvironmentBunnyNodeGroup is the PhetioGroup for EnvironmentBunnyNode, the view of bunnies in the environment.
 * It manages dynamic instances of EnvironmentBunnyNode, as required by PhET-iO. All EnvironmentBunnyNode instances
 * are created and disposed via this group.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../../phet-core/js/merge.js';
import PhetioGroup from '../../../../../tandem/js/PhetioGroup.js';
import PhetioGroupIO from '../../../../../tandem/js/PhetioGroupIO.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import naturalSelection from '../../../naturalSelection.js';
import BunnyCollection from '../../model/BunnyCollection.js';
import SelectedBunnyProperty from '../../model/SelectedBunnyProperty.js';
import EnvironmentBunnyNode from './EnvironmentBunnyNode.js';
import EnvironmentBunnyNodeIO from './EnvironmentBunnyNodeIO.js';

class EnvironmentBunnyNodeGroup extends PhetioGroup {

  /**
   * @param {BunnyCollection} bunnyCollection
   * @param {SelectedBunnyProperty} selectedBunnyProperty
   * @param {Object} [options]
   */
  constructor( bunnyCollection, selectedBunnyProperty, options ) {

    assert && assert( bunnyCollection instanceof BunnyCollection, 'invalid bunnyCollection' );
    assert && assert( selectedBunnyProperty instanceof SelectedBunnyProperty, 'invalid selectedBunnyProperty' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: PhetioGroupIO( EnvironmentBunnyNodeIO ),
      supportsDynamicState: false,
      phetioDocumentation: 'manages dynamic PhET-iO elements of type EnvironmentBunnyNode'
    }, options );

    /**
     * Called to instantiate a BunnyNode.
     * @param {Tandem} tandem - PhetioGroup requires tandem to be the first param
     * @param {Bunny} bunny
     * @returns {Bunny}
     */
    const createElement = ( tandem, bunny ) => {
      return new EnvironmentBunnyNode( bunny, selectedBunnyProperty, {
        tandem: tandem
      } );
    };

    // defaultArguments, passed to createElement during API harvest.
    // Note that bunnyCollection.getArchetype is non-null only during API harvest.
    const defaultArguments = [ bunnyCollection.getArchetype() ];

    super( createElement, defaultArguments, options );
  }
}

naturalSelection.register( 'EnvironmentBunnyNodeGroup', EnvironmentBunnyNodeGroup );
export default EnvironmentBunnyNodeGroup;