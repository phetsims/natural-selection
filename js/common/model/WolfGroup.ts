// Copyright 2020-2022, University of Colorado Boulder

// @ts-nocheck
/**
 * WolfGroup is the PhetioGroup for Wolf.  It manages dynamic instances of Wolf, as required by PhET-iO.
 * All Wolf instances are created and disposed via this group.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import Wolf from './Wolf.js';

export default class WolfGroup extends PhetioGroup {

  /**
   * @param {EnvironmentModelViewTransform} modelViewTransform
   * @param {Object} [options]
   */
  constructor( modelViewTransform, options ) {

    assert && assert( modelViewTransform instanceof EnvironmentModelViewTransform, 'invalid modelViewTransform' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: PhetioGroup.PhetioGroupIO( Wolf.WolfIO ),
      phetioDocumentation: 'manages dynamic PhET-iO elements of type Wolf'
    }, options );

    /**
     * Called to instantiate a Wolf. Note that modelViewTransform is passed via closure, so we don't
     * have to create it as part of defaultArguments, and don't have to deal with serializing it in WolfIO.
     * @param {Tandem} tandem - PhetioGroup requires tandem to be the first param
     * @returns {Wolf}
     */
    const createElement = tandem => new Wolf( modelViewTransform, tandem );

    // defaultArguments, passed to createElement during API harvest
    const defaultArguments = [];

    super( createElement, defaultArguments, options );
  }
}

naturalSelection.register( 'WolfGroup', WolfGroup );