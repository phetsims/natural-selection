// Copyright 2019-2022, University of Colorado Boulder

/**
 * NaturalSelectionScreenView is the base class for all ScreenViews in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import { VBox } from '../../../../scenery/js/imports.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionModel from '../model/NaturalSelectionModel.js';
import SimulationMode from '../model/SimulationMode.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import AddMutationsPanel from './AddMutationsPanel.js';
import BunnyImageMap from './BunnyImageMap.js';
import DiedDialog from './DiedDialog.js';
import EnvironmentalFactorsPanel from './EnvironmentalFactorsPanel.js';
import EnvironmentPanel from './EnvironmentPanel.js';
import GenesVisibilityManager from './GenesVisibilityManager.js';
import GraphChoice from './GraphChoice.js';
import GraphChoiceRadioButtonGroup from './GraphChoiceRadioButtonGroup.js';
import MemoryLimitDialog from './MemoryLimitDialog.js';
import MutationAlertsNode from './MutationAlertsNode.js';
import NaturalSelectionTimeControlNode from './NaturalSelectionTimeControlNode.js';
import PedigreeNode from './pedigree/PedigreeNode.js';
import PopulationNode from './population/PopulationNode.js';
import ProportionsNode from './proportions/ProportionsNode.js';
import WorldDialog from './WorldDialog.js';

type SelfOptions = {

  // whether the user-interface for these features is visible
  furVisible?: boolean;
  earsVisible?: boolean;
  teethVisible?: boolean;
  toughFoodCheckboxVisible?: boolean;
};

type NaturalSelectionScreenViewOptions = SelfOptions & ScreenViewOptions & PickRequired<ScreenViewOptions, 'tandem'>;

export default class NaturalSelectionScreenView extends ScreenView {

  public readonly graphChoiceProperty: EnumerationProperty<GraphChoice>;

  private readonly model: NaturalSelectionModel;
  private readonly environmentPanel: EnvironmentPanel;
  private readonly resetNaturalSelectionScreenView: () => void;

  protected constructor( model: NaturalSelectionModel, providedOptions: NaturalSelectionScreenViewOptions ) {

    const options = optionize<NaturalSelectionScreenViewOptions, SelfOptions, ScreenViewOptions>()( {

      // SelfOptions
      furVisible: true,
      earsVisible: true,
      teethVisible: true,
      toughFoodCheckboxVisible: true
    }, providedOptions );

    super( providedOptions );

    const bunnyImageMap = new BunnyImageMap();

    const environmentPanel = new EnvironmentPanel( model, bunnyImageMap, {
      left: this.layoutBounds.left + NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN,
      top: this.layoutBounds.top + NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'environmentPanel' )
    } );

    // Available width to the right of environmentPanel, used to size control panels
    const rightOfViewportWidth = this.layoutBounds.width - environmentPanel.width -
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

    const controlPanelsParent = new VBox( {
      children: [ addMutationsPanel, environmentalFactorsPanel ],
      spacing: NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
      left: environmentPanel.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
      top: environmentPanel.top
    } );

    // Displays the 'Mutation Coming...' alerts
    const mutationAlertsNode = new MutationAlertsNode( model.genePool, addMutationsPanel, {
      tandem: options.tandem.createTandem( 'mutationAlertsNode' )
    } );

    // The graphs and their related controls fill the space below the viewport.
    const graphAreaSize = new Dimension2(
      environmentPanel.width,
      this.layoutBounds.height - ( 2 * NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN ) -
      environmentPanel.height - NaturalSelectionConstants.SCREEN_VIEW_Y_SPACING
    );
    const graphAreaLeft = environmentPanel.left;
    const graphAreaTop = environmentPanel.bottom + NaturalSelectionConstants.SCREEN_VIEW_Y_SPACING;

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

    this.graphChoiceProperty = new EnumerationProperty( GraphChoice.POPULATION, {
      tandem: graphsTandem.createTandem( 'graphChoiceProperty' ),
      phetioDocumentation: 'the graph choice made via graphChoiceRadioButtonGroup'
    } );

    // Radio buttons for choosing a graph
    const graphChoiceRadioButtonGroup = new GraphChoiceRadioButtonGroup( this.graphChoiceProperty, {
      maxWidth: rightOfViewportWidth,

      // Add PANEL_OPTIONS.xMargin so that radio buttons left-align with controls in panels above them.
      left: environmentPanel.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING + NaturalSelectionConstants.PANEL_OPTIONS.xMargin!,
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

    // layering
    this.children = [
      environmentPanel,
      controlPanelsParent,
      graphChoiceRadioButtonGroup,
      timeControlNode,
      populationNode,
      proportionsNode,
      pedigreeNode,
      resetAllButton,
      mutationAlertsNode
    ];

    this.resetNaturalSelectionScreenView = () => {
      this.graphChoiceProperty.reset();
    };

    // Simulation mode determines which UI components are enabled. unlink is not necessary.
    model.simulationModeProperty.link( simulationMode => {
      const enabled = ( simulationMode !== SimulationMode.COMPLETED );
      addMutationsPanel.setContentEnabled( enabled );
      environmentalFactorsPanel.setContentEnabled( enabled );
      timeControlNode.enabledProperty.value = enabled;
    } );

    // Stuff to do when the simulation needs to be ended.
    const endSimulation = () => {

      // Interrupt any interactions that are in progress
      this.interruptSubtreeInput();

      model.simulationModeProperty.value = SimulationMode.COMPLETED;

      // So we don't leave bunnies captured in mid-hop
      model.bunnyCollection.moveBunniesToGround();
      environmentPanel.updateSprites();
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
    model.memoryLimitEmitter.addListener( () => {
      endSimulation();
      memoryLimitDialog.show();
    } );

    this.model = model;
    this.environmentPanel = environmentPanel;

    // eslint-disable-next-line no-new
    new GenesVisibilityManager( model.genePool, addMutationsPanel, populationNode, proportionsNode, pedigreeNode, {
      furVisible: options.furVisible,
      earsVisible: options.earsVisible,
      teethVisible: options.teethVisible,
      tandem: options.tandem.createTandem( 'genes' )
    } );
  }

  public reset(): void {
    this.resetNaturalSelectionScreenView();
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Steps the view.
   * @param dt - time step, in seconds. Note that dt is currently not used by the view, and constrained by
   *   the model. If it needs to be used by the view, see NaturalSelectionModel.step and GenerationClock.constrainDt.
   */
  public override step( dt: number ): void {
    super.step( dt );
    if ( this.model.isPlayingProperty.value ) {

      // Sim.js calls model.step before view.step. So after all model elements have been updated, this
      // updates the view of their corresponding sprites.
      this.environmentPanel.updateSprites();
    }
  }
}

naturalSelection.register( 'NaturalSelectionScreenView', NaturalSelectionScreenView );