// Copyright 2021-2022, University of Colorado Boulder

/**
 * EnvironmentPanel contains everything that's in the panel at the top-center of the screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Node, NodeTranslationOptions } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionModel from '../model/NaturalSelectionModel.js';
import SimulationMode from '../model/SimulationMode.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import NaturalSelectionQueryParameters from '../NaturalSelectionQueryParameters.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';
import BunnyImageMap from './BunnyImageMap.js';
import EnvironmentNode from './environment/EnvironmentNode.js';
import EnvironmentRadioButtonGroup from './EnvironmentRadioButtonGroup.js';
import GenerationClockNode from './GenerationClockNode.js';
import PerformanceTimesNode from './PerformanceTimesNode.js';
import PlayButtonGroup from './PlayButtonGroup.js';

type SelfOptions = EmptySelfOptions;

type EnvironmentPanelOptions = SelfOptions & NodeTranslationOptions & PickRequired<PanelOptions, 'tandem'>;

export default class EnvironmentPanel extends Panel {

  private readonly environmentNode: EnvironmentNode;

  public constructor( model: NaturalSelectionModel, bunnyImageMap: BunnyImageMap, providedOptions: EnvironmentPanelOptions ) {

    const options = optionize<EnvironmentPanelOptions, SelfOptions, PanelOptions>()( {

      // PanelOptions
      xMargin: 0,
      yMargin: 0,
      cornerRadius: 0,
      fill: null,
      stroke: null,
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    // Where the bunnies, food, etc. are displayed
    const environmentNode = new EnvironmentNode( model, bunnyImageMap, {
      tandem: options.tandem.createTandem( 'environmentNode' )
    } );

    // Generation clock
    const generationClockNode = new GenerationClockNode( model.generationClock,
      model.food.enabledProperty, model.wolfCollection.enabledProperty, {
        centerX: environmentNode.centerX,
        top: environmentNode.top + NaturalSelectionConstants.ENVIRONMENT_DISPLAY_Y_MARGIN - 3,
        tandem: options.tandem.createTandem( 'generationClockNode' )
      } );

    // Environment radio buttons
    const environmentRadioButtonGroup = new EnvironmentRadioButtonGroup( model.environmentProperty, {
      right: environmentNode.right - NaturalSelectionConstants.ENVIRONMENT_DISPLAY_X_MARGIN,
      top: environmentNode.top + NaturalSelectionConstants.ENVIRONMENT_DISPLAY_Y_MARGIN,
      tandem: options.tandem.createTandem( 'environmentRadioButtonGroup' )
    } );

    // The time that it took to execute the 'Start Over' button callback, in ms
    // For performance profiling, see https://github.com/phetsims/natural-selection/issues/140
    const timeToStartOverProperty = new NumberProperty( 0, {
      tandem: Tandem.OPT_OUT
    } );

    // The different buttons that can be used to make the simulation begin playing.
    const playButtonGroup = new PlayButtonGroup(
      model.simulationModeProperty,
      model.bunnyCollection.liveBunnies.lengthProperty, {

        // Callback for the 'Add a Mate' button
        addAMate: () => model.addAMate(),

        // Callback for the 'Start Over' button, with performance profiling,
        // see https://github.com/phetsims/natural-selection/issues/140
        startOver: () => {

          // Like 'Reset All', cancel any interactions that are in progress.
          this.interruptSubtreeInput();

          timeToStartOverProperty.value = NaturalSelectionUtils.time( () => model.startOver() );
        },
        tandem: options.tandem.createTandem( 'playButtonGroup' )
      } );

    // Buttons at center-bottom, adjusted if their text labels change dynamically
    playButtonGroup.boundsProperty.link( () => {
      playButtonGroup.centerX = environmentNode.centerX;
      playButtonGroup.bottom = environmentNode.bottom - NaturalSelectionConstants.ENVIRONMENT_DISPLAY_Y_MARGIN;
    } );

    const content = new Node( {
      children: [ environmentNode, generationClockNode, environmentRadioButtonGroup, playButtonGroup ]
    } );

    super( content, options );

    // Show performance profiling in the upper-left corner of the environment, and in the console.
    // See https://github.com/phetsims/natural-selection/issues/60 and https://github.com/phetsims/natural-selection/issues/140
    if ( NaturalSelectionQueryParameters.showTimes ) {
      this.addChild( new PerformanceTimesNode( model.timeToMateProperty, timeToStartOverProperty, {
        left: environmentNode.left + 5,
        top: environmentNode.top + 5
      } ) );
    }

    // Simulation mode determines which UI components are enabled. unlink is not necessary.
    model.simulationModeProperty.link( simulationMode => {
      environmentRadioButtonGroup.enabledProperty.value = ( simulationMode !== SimulationMode.COMPLETED );
    } );

    this.environmentNode = environmentNode;
  }

  /**
   * Updates sprites to match the model.
   */
  public updateSprites(): void {
    this.environmentNode.updateSprites();
  }
}

naturalSelection.register( 'EnvironmentPanel', EnvironmentPanel );