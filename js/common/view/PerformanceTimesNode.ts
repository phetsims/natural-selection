// Copyright 2020-2022, University of Colorado Boulder

/**
 * PerformanceTimesNode displays times related to performance critical parts of the simulation. This is added via
 * the ?showTimes query parameter, and is for debugging only. It is not translated or instrumented for PhET-iO.
 * See https://github.com/phetsims/natural-selection/issues/60 and https://github.com/phetsims/natural-selection/issues/140
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { NodeTranslationOptions, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';

type SelfOptions = EmptySelfOptions;

type PerformanceTimesNodeOptions = SelfOptions & NodeTranslationOptions;

export default class PerformanceTimesNode extends VBox {

  public constructor( timeToMateProperty: TReadOnlyProperty<number>,
                      timeToStartOverProperty: TReadOnlyProperty<number>,
                      providedOptions?: PerformanceTimesNodeOptions ) {

    const options = optionize<PerformanceTimesNodeOptions, SelfOptions, VBoxOptions>()( {

      // VBoxOptions
      align: 'left',
      spacing: 5
    }, providedOptions );

    // unlink is not necessary.
    const timeToMateDerivedStringProperty = new DerivedProperty( [ timeToMateProperty ],
      timeToMate => `time to mate = ${Utils.roundSymmetric( timeToMate )} ms`
    );
    timeToMateDerivedStringProperty.link( timeToMateString => console.log( timeToMateString ) );

    // Time that it last took to mate.
    // See https://github.com/phetsims/natural-selection/issues/60
    const timeToMateNode = new Text( timeToMateDerivedStringProperty, {
      font: NaturalSelectionConstants.INSTRUCTIONS_FONT
    } );

    // unlink is not necessary.
    const timeToStartOverPropertyDerivedStringProperty = new DerivedProperty( [ timeToStartOverProperty ],
      timeToStartOver => `time to Start Over = ${Utils.roundSymmetric( timeToStartOver )} ms`
    );
    timeToStartOverPropertyDerivedStringProperty.link( timeToStartOverString => console.log( timeToStartOverString ) );

    // Time that it last took to perform the 'Start Over' button callback.
    // See https://github.com/phetsims/natural-selection/issues/140
    const timeToStartOverNode = new Text( timeToStartOverPropertyDerivedStringProperty, {
      font: NaturalSelectionConstants.INSTRUCTIONS_FONT
    } );

    options.children = [ timeToMateNode, timeToStartOverNode ];

    super( options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

naturalSelection.register( 'PerformanceTimesNode', PerformanceTimesNode );