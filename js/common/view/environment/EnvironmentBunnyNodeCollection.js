// Copyright 2020, University of Colorado Boulder

/**
 * EnvironmentBunnyNodeCollection is the collection of EnvironmentBunnyNode instances, with methods for managing that
 * collection. It encapsulates EnvironmentBunnyNodeGroup (the PhetioGroup), hiding it from the rest of the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import naturalSelection from '../../../naturalSelection.js';
import Bunny from '../../model/Bunny.js';
import BunnyCollection from '../../model/BunnyCollection.js';
import SelectedBunnyProperty from '../../model/SelectedBunnyProperty.js';
import EnvironmentBunnyNodeGroup from './EnvironmentBunnyNodeGroup.js';

class EnvironmentBunnyNodeCollection extends PhetioObject {

  /**
   * @param {BunnyCollection} bunnyCollection
   * @param {Property.<Bunny>} selectedBunnyProperty
   * @param {Object} [options]
   */
  constructor( bunnyCollection, selectedBunnyProperty, options ) {

    assert && assert( bunnyCollection instanceof BunnyCollection, 'invalid bunnyCollection' );
    assert && assert( selectedBunnyProperty instanceof SelectedBunnyProperty, 'invalid selectedBunnyProperty' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioState: false
    }, options );

    super( options );

    // @private the PhetioGroup that manages BunnyNode instances as dynamic PhET-iO elements
    this.bunnyNodeGroup = new EnvironmentBunnyNodeGroup( bunnyCollection, selectedBunnyProperty, {
      tandem: options.tandem.createTandem( 'bunnyNodeGroup' )
    } );
  }

  /**
   * Creates a BunnyNode for a Bunny. Wires up a callback to handle disposal when the Bunny dies or is disposed.
   * @param {Bunny} bunny
   * @returns {BunnyNode}
   * @public
   */
  createBunnyNode( bunny ) {
    assert && assert( bunny instanceof Bunny, 'invalid bunny' );

    // Create the BunnyNode
    const bunnyNode = this.bunnyNodeGroup.createCorrespondingGroupElement( bunny.tandem.name, bunny );

    // If the bunny dies or is disposed, dispose of the associated BunnyNode.
    const disposeBunnyNode = () => {
      bunny.diedEmitter.removeListener( disposeBunnyNode );
      bunny.disposedEmitter.removeListener( disposeBunnyNode );
      this.bunnyNodeGroup.disposeElement( bunnyNode );
    };
    bunny.diedEmitter.addListener( disposeBunnyNode );
    bunny.disposedEmitter.addListener( disposeBunnyNode );

    return bunnyNode;
  }
}

naturalSelection.register( 'EnvironmentBunnyNodeCollection', EnvironmentBunnyNodeCollection );
export default EnvironmentBunnyNodeCollection;