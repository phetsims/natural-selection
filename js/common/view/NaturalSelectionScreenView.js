// Copyright 2019-2020, University of Colorado Boulder

/**
 * NaturalSelectionScreenView is the base class for all ScreenViews in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import merge from '../../../../phet-core/js/merge.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionModel from '../model/NaturalSelectionModel.js';
import SimulationMode from '../model/SimulationMode.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import AddMutationsPanel from './AddMutationsPanel.js';
import DiedDialog from './DiedDialog.js';
import EnvironmentalFactorsPanel from './EnvironmentalFactorsPanel.js';
import EnvironmentNode from './EnvironmentNode.js';
import Graphs from './Graphs.js';
import GraphsRadioButtonGroup from './GraphsRadioButtonGroup.js';
import MutationAlertsNode from './MutationAlertsNode.js';
import NaturalSelectionViewProperties from './NaturalSelectionViewProperties.js';
import PedigreeNode from './pedigree/PedigreeNode.js';
import PlayButtonGroup from './PlayButtonGroup.js';
import PopulationNode from './population/PopulationNode.js';
import ProportionsNode from './proportions/ProportionsNode.js';
import WorldDialog from './WorldDialog.js';

class NaturalSelectionScreenView extends ScreenView {

  /**
   * @param {NaturalSelectionModel} model
   * @param {NaturalSelectionViewProperties} viewProperties
   * @param {Object} [options]
   */
  constructor( model, viewProperties, options ) {

    assert && assert( model instanceof NaturalSelectionModel, 'invalid model' );
    assert && assert( viewProperties instanceof NaturalSelectionViewProperties, 'invalid viewProperties' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    const environmentNode = new EnvironmentNode( model.environmentModel, {
      left: this.layoutBounds.left + NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN,
      top: this.layoutBounds.top + NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'environmentNode' )
    } );

    // Available width to the right of environmentNode, used to size control panels
    const rightOfViewportWidth = this.layoutBounds.width - environmentNode.width -
                                 ( 2 * NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN ) -
                                 NaturalSelectionConstants.SCREEN_VIEW_X_SPACING;

    const addMutationsPanel = new AddMutationsPanel( {
      fixedWidth: rightOfViewportWidth,
      tandem: options.tandem.createTandem( 'addMutationsPanel' )
    } );

    const environmentalFactorsPanel = new EnvironmentalFactorsPanel( model.environmentModel, {
      fixedWidth: rightOfViewportWidth,
      tandem: options.tandem.createTandem( 'environmentalFactorsPanel' )
    } );

    const panelsParent = new VBox( {
      children: [ addMutationsPanel, environmentalFactorsPanel ],
      spacing: NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
      left: environmentNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
      top: environmentNode.top
    } );

    const mutationAlertsNode = new MutationAlertsNode( addMutationsPanel );

    // The graphs and their related controls fill the space below the viewport.
    const graphAreaSize = new Dimension2(
      environmentNode.width,
      this.layoutBounds.height - ( 2 * NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN ) -
      environmentNode.height - NaturalSelectionConstants.SCREEN_VIEW_Y_SPACING
    );
    const graphAreaLeft = environmentNode.left;
    const graphAreaTop = environmentNode.bottom + NaturalSelectionConstants.SCREEN_VIEW_Y_SPACING;

    // Population
    const populationNode = new PopulationNode( model.populationModel, graphAreaSize, {
      left: graphAreaLeft,
      y: graphAreaTop,
      tandem: options.tandem.createTandem( 'populationNode' )
    } );

    // Proportions
    const proportionsNode = new ProportionsNode( model.proportionsModel, graphAreaSize, {
      left: graphAreaLeft,
      top: graphAreaTop,
      tandem: options.tandem.createTandem( 'proportionsNode' )
    } );

    // Pedigree
    const pedigreeNode = new PedigreeNode( model.pedigreeModel, graphAreaSize, {
      left: graphAreaLeft,
      top: graphAreaTop,
      tandem: options.tandem.createTandem( 'pedigreeNode' )
    } );

    // Population, Proportions, Pedigree radio buttons
    const graphsRadioButtonGroup = new GraphsRadioButtonGroup( viewProperties.graphProperty, {
      maxWidth: rightOfViewportWidth,
      left: environmentNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
      centerY: populationNode.centerY,
      tandem: options.tandem.createTandem( 'graphsRadioButtonGroup' )
    } );

    // Visibility of graphs is mutually exclusive
    viewProperties.graphProperty.link( graph => {
      populationNode.visible = ( graph === Graphs.POPULATION );
      proportionsNode.visible = ( graph === Graphs.PROPORTIONS );
      pedigreeNode.visible = ( graph === Graphs.PEDIGREE );
    } );

    // Play/pause/step time controls
    const timeControlNode = new TimeControlNode( model.isPlayingProperty, {
      playPauseStepButtonOptions: {
        stepForwardButtonOptions: {

          //TODO Should this step such that generationClock.timeProperty.value is a multiple of SECONDS_PER_STEP?
          listener: () => {
            model.stepOnce( NaturalSelectionConstants.SECONDS_PER_STEP );
            this.stepOnce( NaturalSelectionConstants.SECONDS_PER_STEP );
          }
        }
      },
      left: environmentNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
      bottom: this.layoutBounds.bottom - NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'timeControlNode' )
    } );

    // Reset All push button
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that are in progress
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.right - NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.bottom - NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );

    // The different buttons that can be used to make the simulation begin playing.
    const playButtonGroup = new PlayButtonGroup(
      model.simulationModeProperty,
      model.environmentModel.bunnyGroup.numberOfBunniesProperty, {
        addAMate: () => model.environmentModel.addAMate(),
        playAgain: () => model.reset(),
        centerX: environmentNode.centerX,
        bottom: environmentNode.bottom - NaturalSelectionConstants.ENVIRONMENT_DISPLAY_Y_MARGIN,
        tandem: options.tandem.createTandem( 'playButtonGroup' )
      } );

    // layering
    this.children = [
      environmentNode,
      playButtonGroup,
      panelsParent,
      graphsRadioButtonGroup,
      timeControlNode,
      populationNode,
      proportionsNode,
      pedigreeNode,
      resetAllButton,
      mutationAlertsNode
    ];

    // @private
    this.resetNaturalSelectionScreenView = () => {
      environmentNode.reset();
      addMutationsPanel.reset();
      mutationAlertsNode.reset();
      populationNode.reset();
    };

    // Simulation mode determines which UI controls are enabled.
    model.simulationModeProperty.link( simulationMode => {
      if ( simulationMode === SimulationMode.STAGED ) {
        addMutationsPanel.setContentEnabled( true );
        environmentalFactorsPanel.setContentEnabled( true );
        timeControlNode.enabledProperty.value = true;
      }
      else if ( simulationMode === SimulationMode.ACTIVE ) {
        addMutationsPanel.setContentEnabled( true );
        environmentalFactorsPanel.setContentEnabled( true );
        timeControlNode.enabledProperty.value = true;
      }
      else if ( simulationMode === SimulationMode.COMPLETED ) {
        addMutationsPanel.setContentEnabled( false );
        environmentalFactorsPanel.setContentEnabled( false );
        timeControlNode.enabledProperty.value = false;
      }
      else {
        throw new Error( `invalid simulationMode: ${simulationMode}` );
      }
    } );

    // Display a dialog when all bunnies have died.
    const diedDialog = new DiedDialog();
    model.environmentModel.bunnyGroup.allBunniesHaveDiedEmitter.addListener( () => {
      diedDialog.show();
      model.simulationModeProperty.value = SimulationMode.COMPLETED;
    } );

    // Display a dialog when bunnies have taken over the world.
    const worldDialog = new WorldDialog();
    model.environmentModel.bunnyGroup.bunniesHaveTakenOverTheWorldEmitter.addListener( () => {
      worldDialog.show();
      model.simulationModeProperty.value = SimulationMode.COMPLETED;
    } );

    // @private
    this.model = model;
    this.environmentNode = environmentNode;
  }

  /**
   * @public
   */
  reset() {
    this.resetNaturalSelectionScreenView();
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'NaturalSelectionScreenView does not support dispose' );
  }

  /**
   * Steps the view.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    if ( this.model.isPlayingProperty.value ) {
      this.stepOnce( dt );
    }
  }

  /**
   * Steps the view one time step. Used by the time controls Step button.
   * @param {number} dt - time step, in seconds
   * @public
   */
  stepOnce( dt ) {
    this.environmentNode.step( dt );
  }
}

naturalSelection.register( 'NaturalSelectionScreenView', NaturalSelectionScreenView );
export default NaturalSelectionScreenView;