// Copyright 2020, University of Colorado Boulder

/**
 * WolfNodeGroup is the PhetioGroup for WolfNode.  It manages dynamic instances of WolfNode, as required by PhET-iO.
 * All WolfNode instances are created and disposed via this group.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import PhetioGroupIO from '../../../../tandem/js/PhetioGroupIO.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import WolfCollection from '../model/WolfCollection.js';
import WolfNode from './WolfNode.js';
import WolfNodeIO from './WolfNodeIO.js';

class WolfNodeGroup extends PhetioGroup {

  /**
   * @param {WolfCollection} wolfCollection
   * @param {Object} [options]
   */
  constructor( wolfCollection, options ) {

    assert && assert( wolfCollection instanceof WolfCollection, 'invalid wolfCollection' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: PhetioGroupIO( WolfNodeIO ),
      supportsDynamicState: false,
      phetioDocumentation: 'manages dynamic PhET-iO elements of type WolfNode'
    }, options );

    /**
     * Called to instantiate a WolfNode.
     * @param {Tandem} tandem - PhetioGroup requires tandem to be the first param
     * @param {Wolf} wolf
     * @returns {Wolf}
     */
    const createElement = ( tandem, wolf ) => {
      return new WolfNode( wolf, {
        tandem: tandem
      } );
    };

    // defaultArguments, passed to createElement during API harvest
    // Note that wolfCollection.getArchetype is non-null only during API harvest.
    const defaultArguments = [ wolfCollection.getArchetype() ];

    super( createElement, defaultArguments, options );
  }
}

naturalSelection.register( 'WolfNodeGroup', WolfNodeGroup );
export default WolfNodeGroup;