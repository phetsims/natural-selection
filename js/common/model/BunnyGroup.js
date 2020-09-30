// Copyright 2020, University of Colorado Boulder

/**
 * BunnyGroup is the PhetioGroup for Bunny.  It manages dynamic instances of Bunny, as required by PhET-iO.
 * All Bunny instances are created and disposed via this group.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import Bunny from './Bunny.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import GenePool from './GenePool.js';

class BunnyGroup extends PhetioGroup {

  /**
   * @param {GenePool} genePool
   * @param {EnvironmentModelViewTransform} modelViewTransform
   * @param {Property.<Range>} bunnyRestRangeProperty
   * @param {Object} [options]
   */
  constructor( genePool, modelViewTransform, bunnyRestRangeProperty, options ) {

    assert && assert( genePool instanceof GenePool, 'invalid genePool' );
    assert && assert( modelViewTransform instanceof EnvironmentModelViewTransform, 'invalid modelViewTransform' );
    assert && AssertUtils.assertPropertyOf( bunnyRestRangeProperty, Range );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: PhetioGroup.PhetioGroupIO( Bunny.BunnyIO ),
      phetioDocumentation: 'manages dynamic PhET-iO elements of type Bunny, including live and dead bunnies'
    }, options );

    /**
     * Called to instantiate a Bunny. Note that genePool and modelViewTransform arguments to Bunny constructor
     * are passed via closure, so we don't have to create them as part of defaultArguments, and don't have to
     * deal with serializing them in BunnyIO.
     * @param {Tandem} tandem - PhetioGroup requires tandem to be the first param
     * @param {Object} bunnyOptions - options to Bunny constructor, not actually optional, because createElement
     *                                must have a fixed number of args
     * @returns {Bunny}
     */
    const createElement = ( tandem, bunnyOptions ) => {
      return new Bunny( genePool, modelViewTransform, bunnyRestRangeProperty, merge( {}, bunnyOptions, {
        tandem: tandem
      } ) );
    };

    // defaultArguments, passed to createElement during API harvest
    const defaultArguments = [ {} ];

    super( createElement, defaultArguments, options );
  }
}

naturalSelection.register( 'BunnyGroup', BunnyGroup );
export default BunnyGroup;