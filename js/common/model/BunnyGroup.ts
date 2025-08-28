// Copyright 2020-2025, University of Colorado Boulder

/**
 * BunnyGroup is the PhetioGroup for Bunny.  It manages dynamic instances of Bunny, as required by PhET-iO.
 * All Bunny instances are created and disposed via this group.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PhetioGroup, { PhetioGroupOptions } from '../../../../tandem/js/PhetioGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import Bunny, { BunnyOptions } from './Bunny.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import GenePool from './GenePool.js';

type SelfOptions = EmptySelfOptions;

type BunnyGroupOptions = SelfOptions & PickRequired<PhetioGroupOptions, 'tandem'>;

// tandem is omitted because BunnyGroup provides the tandem.
export type BunnyGroupCreateElementOptions = StrictOmit<BunnyOptions, 'tandem'>;

// Arguments to createElement, other than tandem.
export type BunnyGroupCreateElementArguments = [ BunnyGroupCreateElementOptions ];

export default class BunnyGroup extends PhetioGroup<Bunny, BunnyGroupCreateElementArguments> {

  public constructor( genePool: GenePool,
                      modelViewTransform: EnvironmentModelViewTransform,
                      bunnyRestRangeProperty: TReadOnlyProperty<Range>,
                      providedOptions: BunnyGroupOptions ) {

    const options = optionize<BunnyGroupOptions, SelfOptions, PhetioGroupOptions>()( {

      // Since this sim has already been published with PhET-iO + migration support, it isn't worth changing initial indexing
      // of group elements from 0 -> 1, see https://github.com/phetsims/tandem/issues/226
      groupElementStartingIndex: 0,

      // PhetioGroupOptions
      phetioType: PhetioGroup.PhetioGroupIO( Bunny.BunnyIO ),
      phetioDocumentation: 'manages dynamic PhET-iO Elements of type Bunny, including live and dead bunnies'
    }, providedOptions );

    /**
     * Called to instantiate a Bunny. Note that genePool and modelViewTransform arguments to Bunny constructor
     * are passed via closure, so we don't have to create them as part of defaultArguments, and don't have to
     * deal with serializing them in BunnyIO.
     * @param tandem - PhetioGroup requires tandem to be the first param
     * @param [providedOptions]
     */
    const createElement = ( tandem: Tandem, providedOptions?: BunnyGroupCreateElementOptions ) => {
      return new Bunny( genePool, modelViewTransform, bunnyRestRangeProperty,
        combineOptions<BunnyOptions>( {
          tandem: tandem
        }, providedOptions ) );
    };

    // defaultArguments, passed to createElement during API harvest
    const defaultArguments: BunnyGroupCreateElementArguments = [ {} ];

    super( createElement, defaultArguments, options );
  }
}

naturalSelection.register( 'BunnyGroup', BunnyGroup );