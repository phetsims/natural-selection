// Copyright 2020-2022, University of Colorado Boulder

/**
 * WolfGroup is the PhetioGroup for Wolf.  It manages dynamic instances of Wolf, as required by PhET-iO.
 * All Wolf instances are created and disposed via this group.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioGroup, { PhetioGroupOptions } from '../../../../tandem/js/PhetioGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import Wolf from './Wolf.js';

type SelfOptions = EmptySelfOptions;

type WolfGroupOptions = SelfOptions & PickRequired<PhetioGroupOptions, 'tandem'>;

export default class WolfGroup extends PhetioGroup<Wolf> {

  public constructor( modelViewTransform: EnvironmentModelViewTransform, providedOptions: WolfGroupOptions ) {

    const options = optionize<WolfGroupOptions, SelfOptions, PhetioGroupOptions>()( {

      // PhetioGroupOptions
      phetioType: PhetioGroup.PhetioGroupIO( Wolf.WolfIO ),
      phetioDocumentation: 'manages dynamic PhET-iO elements of type Wolf'
    }, providedOptions );

    /**
     * Called to instantiate a Wolf. Note that modelViewTransform is passed via closure, so we don't
     * have to create it as part of defaultArguments, and don't have to deal with serializing it in WolfIO.
     * @param tandem - PhetioGroup requires tandem to be the first param
     */
    const createElement = ( tandem: Tandem ) => new Wolf( modelViewTransform, tandem );

    // defaultArguments, passed to createElement during API harvest
    const defaultArguments: [] = [];

    super( createElement, defaultArguments, options );
  }
}

naturalSelection.register( 'WolfGroup', WolfGroup );