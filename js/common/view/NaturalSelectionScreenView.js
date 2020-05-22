// Copyright 2019-2020, University of Colorado Boulder

/**
 * NaturalSelectionScreenView is the base class for all ScreenViews in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
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
import GenesVisibilityManager from './GenesVisibilityManager.js';
import GraphChoice from './GraphChoice.js';
import GraphChoiceRadioButtonGroup from './GraphChoiceRadioButtonGroup.js';
import MutationAlertsNode from './MutationAlertsNode.js';
import PedigreeNode from './pedigree/PedigreeNode.js';
import PlayButtonGroup from './PlayButtonGroup.js';
import PopulationNode from './population/PopulationNode.js';
import ProportionsNode from './proportions/ProportionsNode.js';
import WorldDialog from './WorldDialog.js';

class NaturalSelectionScreenView extends ScreenView {

  /**
   * @param {NaturalSelectionModel} model
   * @param {Object} [options]
   */
  constructor( model, options ) {

    assert && assert( model instanceof NaturalSelectionModel, 'invalid model' );

    options = merge( {

      // whether the user-interface for these features is visible
      furVisible: true,
      earsVisible: true,
      teethVisible: true,
      toughFoodCheckboxVisible: true,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    const environmentNode = new EnvironmentNode( model, {
      left: this.layoutBounds.left + NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN,
      top: this.layoutBounds.top + NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'environmentNode' )
    } );

    // Available width to the right of environmentNode, used to size control panels
    const rightOfViewportWidth = this.layoutBounds.width - environmentNode.width -
                                 ( 2 * NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN ) -
                                 NaturalSelectionConstants.SCREEN_VIEW_X_SPACING;

    const addMutationsPanel = new AddMutationsPanel( model.genePool, {
      fixedWidth: rightOfViewportWidth,
      tandem: options.tandem.createTandem( 'addMutationsPanel' )
    } );

    const environmentalFactorsPanel = new EnvironmentalFactorsPanel( model.wolves, model.food, {
      toughFoodCheckboxVisible: options.toughFoodCheckboxVisible,
      fixedWidth: rightOfViewportWidth,
      tandem: options.tandem.createTandem( 'environmentalFactorsPanel' )
    } );

    const panelsParent = new VBox( {
      children: [ addMutationsPanel, environmentalFactorsPanel ],
      spacing: NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
      left: environmentNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
      top: environmentNode.top
    } );

    const mutationAlertsNode = new MutationAlertsNode( model.genePool, addMutationsPanel );

    // The graphs and their related controls fill the space below the viewport.
    const graphAreaSize = new Dimension2(
      environmentNode.width,
      this.layoutBounds.height - ( 2 * NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN ) -
      environmentNode.height - NaturalSelectionConstants.SCREEN_VIEW_Y_SPACING
    );
    const graphAreaLeft = environmentNode.left;
    const graphAreaTop = environmentNode.bottom + NaturalSelectionConstants.SCREEN_VIEW_Y_SPACING;

    // Organize everything related to graphs under this tandem
    const graphsTandem = options.tandem.createTandem( 'graphs' );

    // Population
    const populationNode = new PopulationNode( model.populationModel, graphAreaSize, {
      left: graphAreaLeft,
      y: graphAreaTop,
      tandem: graphsTandem.createTandem( 'populationNode' )
    } );

    // Proportions
    const proportionsNode = new ProportionsNode( model.proportionsModel, model.genePool, model.simulationModeProperty,
      graphAreaSize, {
        left: graphAreaLeft,
        top: graphAreaTop,
        tandem: graphsTandem.createTandem( 'proportionsNode' )
      } );

    // Pedigree
    const pedigreeNode = new PedigreeNode( model.pedigreeModel, model.genePool, graphAreaSize, {
      left: graphAreaLeft,
      top: graphAreaTop,
      tandem: graphsTandem.createTandem( 'pedigreeNode' )
    } );

    // @public
    this.graphChoiceProperty = new EnumerationProperty( GraphChoice, GraphChoice.POPULATION, {
      tandem: graphsTandem.createTandem( 'graphChoiceProperty' ),
      phetioDocumentation: 'the graph choice made via graphChoiceRadioButtonGroup'
    } );

    // Radio buttons for choosing a graph
    const graphChoiceRadioButtonGroup = new GraphChoiceRadioButtonGroup( this.graphChoiceProperty, {
      maxWidth: rightOfViewportWidth,
      left: environmentNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
      centerY: populationNode.centerY,
      tandem: graphsTandem.createTandem( 'graphChoiceRadioButtonGroup' )
    } );

    // Visibility of graphs
    this.graphChoiceProperty.link( graph => {
      populationNode.visible = ( graph === GraphChoice.POPULATION );
      proportionsNode.visible = ( graph === GraphChoice.PROPORTIONS );
      pedigreeNode.visible = ( graph === GraphChoice.PEDIGREE );
    } );

    // Play/pause/step time controls
    const timeControlNode = new TimeControlNode( model.isPlayingProperty, {
      playPauseStepButtonOptions: {
        stepForwardButtonOptions: {
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
      model.bunnyCollection.liveBunnies.lengthProperty, {
        addAMate: () => model.addAMate(),
        startOver: () => model.startOver(),
        centerX: environmentNode.centerX,
        bottom: environmentNode.bottom - NaturalSelectionConstants.ENVIRONMENT_DISPLAY_Y_MARGIN,
        tandem: options.tandem.createTandem( 'playButtonGroup' )
      } );

    // layering
    this.children = [
      environmentNode,
      playButtonGroup,
      panelsParent,
      graphChoiceRadioButtonGroup,
      timeControlNode,
      populationNode,
      proportionsNode,
      pedigreeNode,
      resetAllButton,
      mutationAlertsNode
    ];

    //TODO verify that these resets are needed
    // @private
    this.resetNaturalSelectionScreenView = () => {
      this.graphChoiceProperty.reset();
      environmentNode.reset();
      populationNode.reset();
    };

    // Simulation mode determines which UI controls are enabled.
    model.simulationModeProperty.link( simulationMode => {
      if ( simulationMode === SimulationMode.STAGED ) {
        addMutationsPanel.setContentEnabled( true );
        environmentalFactorsPanel.setContentEnabled( true );
        timeControlNode.enabledProperty.value = true;
        environmentNode.environmentRadioButtonGroup.enabledProperty.value = true;
      }
      else if ( simulationMode === SimulationMode.ACTIVE ) {
        addMutationsPanel.setContentEnabled( true );
        environmentalFactorsPanel.setContentEnabled( true );
        timeControlNode.enabledProperty.value = true;
        environmentNode.environmentRadioButtonGroup.enabledProperty.value = true;
      }
      else if ( simulationMode === SimulationMode.COMPLETED ) {
        addMutationsPanel.setContentEnabled( false );
        environmentalFactorsPanel.setContentEnabled( false );
        timeControlNode.enabledProperty.value = false;
        environmentNode.environmentRadioButtonGroup.enabledProperty.value = false;
      }
      else {
        throw new Error( `invalid simulationMode: ${simulationMode}` );
      }
    } );

    // Display a dialog when all bunnies have died.
    const diedDialog = new DiedDialog();
    model.bunnyCollection.allBunniesHaveDiedEmitter.addListener( () => {
      diedDialog.show();
      model.simulationModeProperty.value = SimulationMode.COMPLETED;
    } );

    // Display a dialog when bunnies have taken over the world.
    const worldDialog = new WorldDialog( {
      showCallback: () => {

        // so we don't leave bunnies captured in mid-hop
        model.bunnyCollection.groundAllBunnies();
        environmentNode.sortSprites();
      }
    } );
    model.bunnyCollection.bunniesHaveTakenOverTheWorldEmitter.addListener( () => {
      worldDialog.show();
      model.simulationModeProperty.value = SimulationMode.COMPLETED;
    } );

    // @private
    this.model = model;
    this.environmentNode = environmentNode;

    /* eslint-disable no-new */
    new GenesVisibilityManager( addMutationsPanel, populationNode, proportionsNode, pedigreeNode, {
      furVisible: options.furVisible,
      earsVisible: options.earsVisible,
      teethVisible: options.teethVisible,
      tandem: options.tandem.createTandem( 'genes' )
    } );
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