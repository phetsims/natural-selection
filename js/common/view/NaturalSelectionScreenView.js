// Copyright 2019-2020, University of Colorado Boulder

/**
 * NaturalSelectionScreenView is the base class for all ScreenViews in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import merge from '../../../../phet-core/js/merge.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionModel from '../model/NaturalSelectionModel.js';
import SimulationMode from '../model/SimulationMode.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import NaturalSelectionQueryParameters from '../NaturalSelectionQueryParameters.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';
import AddMutationsPanel from './AddMutationsPanel.js';
import BunnyImageMap from './BunnyImageMap.js';
import DiedDialog from './DiedDialog.js';
import EnvironmentNode from './environment/EnvironmentNode.js';
import EnvironmentalFactorsPanel from './EnvironmentalFactorsPanel.js';
import EnvironmentRadioButtonGroup from './EnvironmentRadioButtonGroup.js';
import GenerationClockNode from './GenerationClockNode.js';
import GenesVisibilityManager from './GenesVisibilityManager.js';
import GraphChoice from './GraphChoice.js';
import GraphChoiceRadioButtonGroup from './GraphChoiceRadioButtonGroup.js';
import MemoryLimitDialog from './MemoryLimitDialog.js';
import MutationAlertsNode from './MutationAlertsNode.js';
import NaturalSelectionTimeControlNode from './NaturalSelectionTimeControlNode.js';
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

    const bunnyImageMap = new BunnyImageMap();

    const environmentNode = new EnvironmentNode( model, bunnyImageMap, {
      left: this.layoutBounds.left + NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN,
      top: this.layoutBounds.top + NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'environmentNode' )
    } );

    // Generation clock
    const generationClockNode = new GenerationClockNode( model.generationClock,
      model.food.enabledProperty, model.wolfCollection.enabledProperty, {
        centerX: environmentNode.centerX,
        top: environmentNode.top + NaturalSelectionConstants.ENVIRONMENT_DISPLAY_Y_MARGIN,
        tandem: options.tandem.createTandem( 'generationClockNode' )
      } );

    // Environment radio buttons
    const environmentRadioButtonGroup = new EnvironmentRadioButtonGroup( model.environmentProperty, {
      right: environmentNode.right - NaturalSelectionConstants.ENVIRONMENT_DISPLAY_X_MARGIN,
      top: environmentNode.top + NaturalSelectionConstants.ENVIRONMENT_DISPLAY_Y_MARGIN,
      tandem: options.tandem.createTandem( 'environmentRadioButtonGroup' )
    } );

    // Available width to the right of environmentNode, used to size control panels
    const rightOfViewportWidth = this.layoutBounds.width - environmentNode.width -
                                 ( 2 * NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN ) -
                                 NaturalSelectionConstants.SCREEN_VIEW_X_SPACING;

    const addMutationsPanel = new AddMutationsPanel( model.genePool, {
      fixedWidth: rightOfViewportWidth,
      tandem: options.tandem.createTandem( 'addMutationsPanel' )
    } );

    const environmentalFactorsPanel = new EnvironmentalFactorsPanel( model.wolfCollection.enabledProperty,
      model.food.isToughProperty, model.food.isLimitedProperty, {
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

    // Displays the 'Mutation Coming...' alerts
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
    const proportionsNode = new ProportionsNode( model.proportionsModel, model.genePool,
      graphAreaSize, {
        left: graphAreaLeft,
        top: graphAreaTop,
        tandem: graphsTandem.createTandem( 'proportionsNode' )
      } );

    // Pedigree
    const pedigreeNode = new PedigreeNode( model.pedigreeModel, model.bunnyCollection.selectedBunnyProperty,
      model.genePool, bunnyImageMap, graphAreaSize, {
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

      // Add PANEL_OPTIONS.xMargin so that radio buttons left-align with controls in panels above them.
      left: environmentNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING + NaturalSelectionConstants.PANEL_OPTIONS.xMargin,
      centerY: populationNode.centerY,
      tandem: graphsTandem.createTandem( 'graphChoiceRadioButtonGroup' )
    } );

    // Visibility of graphs. unlink is not necessary.
    this.graphChoiceProperty.link( graph => {
      populationNode.visible = ( graph === GraphChoice.POPULATION );
      proportionsNode.visible = ( graph === GraphChoice.PROPORTIONS );
      pedigreeNode.visible = ( graph === GraphChoice.PEDIGREE );
    } );

    // Play/pause/step time controls
    const timeControlNode = new NaturalSelectionTimeControlNode( model.isPlayingProperty, model.timeSpeedProperty, {
      left: graphChoiceRadioButtonGroup.left,
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
        //TODO https://github.com/phetsims/natural-selection/issues/140 remove NaturalSelectionUtils.time
        //startOver: () => model.startOver(),
        startOver: () => {
          model.timeToStartOverProperty.value = NaturalSelectionUtils.time( () => model.startOver() );
        },
        centerX: environmentNode.centerX,
        bottom: environmentNode.bottom - NaturalSelectionConstants.ENVIRONMENT_DISPLAY_Y_MARGIN,
        tandem: options.tandem.createTandem( 'playButtonGroup' )
      } );

    // layering
    this.children = [
      environmentNode,
      generationClockNode,
      environmentRadioButtonGroup,
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

    // @private
    this.resetNaturalSelectionScreenView = () => {
      this.graphChoiceProperty.reset();
    };

    // Simulation mode determines which UI controls are enabled. unlink is not necessary.
    model.simulationModeProperty.link( simulationMode => {
      if ( simulationMode === SimulationMode.STAGED ) {
        addMutationsPanel.setContentEnabled( true );
        environmentalFactorsPanel.setContentEnabled( true );
        timeControlNode.enabledProperty.value = true;
        environmentRadioButtonGroup.enabledProperty.value = true;
      }
      else if ( simulationMode === SimulationMode.ACTIVE ) {
        addMutationsPanel.setContentEnabled( true );
        environmentalFactorsPanel.setContentEnabled( true );
        timeControlNode.enabledProperty.value = true;
        environmentRadioButtonGroup.enabledProperty.value = true;
      }
      else if ( simulationMode === SimulationMode.COMPLETED ) {
        addMutationsPanel.setContentEnabled( false );
        environmentalFactorsPanel.setContentEnabled( false );
        timeControlNode.enabledProperty.value = false;
        environmentRadioButtonGroup.enabledProperty.value = false;
      }
      else {
        throw new Error( `invalid simulationMode: ${simulationMode}` );
      }
    } );

    // Stuff to do when the simulation needs to be ended.
    const endSimulation = () => {

      // Interrupt any interactions that are in progress
      this.interruptSubtreeInput();

      model.simulationModeProperty.value = SimulationMode.COMPLETED;

      // So we don't leave bunnies captured in mid-hop
      model.bunnyCollection.moveBunniesToGround();
      environmentNode.updateSprites();
    };

    // Group all dialogs in Studio
    const dialogsTandem = options.tandem.createTandem( 'dialogs' );

    // Display a dialog when all bunnies have died.
    const diedDialog = new DiedDialog( {
      tandem: dialogsTandem.createTandem( 'diedDialog' )
    } );

    // removeListener is not necessary.
    model.bunnyCollection.allBunniesHaveDiedEmitter.addListener( () => {
      endSimulation();
      diedDialog.show();
    } );

    // Display a dialog when bunnies have taken over the world.
    const worldDialog = new WorldDialog( {
      tandem: dialogsTandem.createTandem( 'worldDialog' )
    } );

    // removeListener is not necessary.
    model.bunnyCollection.bunniesHaveTakenOverTheWorldEmitter.addListener( () => {
      endSimulation();
      worldDialog.show();
    } );

    // Display a dialog when we hit the memory limit (which is actually a generation limit).
    // See https://github.com/phetsims/natural-selection/issues/46
    const memoryLimitDialog = new MemoryLimitDialog( {
      tandem: dialogsTandem.createTandem( 'memoryLimitDialog' )
    } );

    // removeListener is not necessary.
    model.generationClock.currentGenerationProperty.link( currentGeneration => {
      if ( currentGeneration >= NaturalSelectionQueryParameters.maxGenerations ) {
        endSimulation();
        memoryLimitDialog.show();
      }
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

    //TODO https://github.com/phetsims/natural-selection/issues/60 delete this block
    if ( NaturalSelectionQueryParameters.showTimes ) {

      const timeToMateNode = new Text( '', {
        font: new PhetFont( 20 ),
        left: environmentNode.left + 5,
        top: environmentNode.top + 5
      } );
      this.addChild( timeToMateNode );

      model.timeToMateProperty.link( timeToMate => {
        const t = Utils.roundSymmetric( timeToMate );
        timeToMateNode.text = `time to mate = ${t} ms`;
        console.log( timeToMateNode.text );
      } );

      const timeToStartOverNode = new Text( '', {
        font: new PhetFont( 20 ),
        left: environmentNode.left + 5,
        top: timeToMateNode.bottom + 5
      } );
      this.addChild( timeToStartOverNode );

      model.timeToStartOverProperty.link( timeToStartOver => {
        const t = Utils.roundSymmetric( timeToStartOver );
        timeToStartOverNode.text = `time to Start Over = ${t} ms`;
        console.log( timeToStartOverNode.text );
      } );
    }
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
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Steps the view.
   * @param {number} dt - time step, in seconds. Note that dt is currently not used by the view, and constrained by
   *   the model. If it needs to be used by the view, see NaturalSelectionModel.step and GenerationClock.constrainDt.
   * @public
   */
  step( dt ) {
    if ( this.model.isPlayingProperty.value ) {

      // Sim.js calls model.step before view.step. So after all of the model elements have been updated, this
      // updates the view of their corresponding sprites.
      this.environmentNode.updateSprites();
    }
  }
}

naturalSelection.register( 'NaturalSelectionScreenView', NaturalSelectionScreenView );
export default NaturalSelectionScreenView;