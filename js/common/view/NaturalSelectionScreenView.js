// Copyright 2019, University of Colorado Boulder

/**
 * NaturalSelectionScreenView is the base class for all ScreenViews in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AbioticEnvironmentRadioButtonGroup = require( 'NATURAL_SELECTION/common/view/AbioticEnvironmentRadioButtonGroup' );
  const AddAMateButton = require( 'NATURAL_SELECTION/common/view/AddAMateButton' );
  const AddMutationPanel = require( 'NATURAL_SELECTION/common/view/AddMutationPanel' );
  const GenerationClockNode = require( 'NATURAL_SELECTION/common/view/GenerationClockNode' );
  const GraphRadioButtonGroup = require( 'NATURAL_SELECTION/common/view/GraphRadioButtonGroup' );
  const Graphs = require( 'NATURAL_SELECTION/common/view/Graphs' );
  const LimitedFoodCheckbox = require( 'NATURAL_SELECTION/common/view/LimitedFoodCheckbox' );
  const MutationComingNode = require( 'NATURAL_SELECTION/common/view/MutationComingNode' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const NaturalSelectionTimeControlNode = require( 'NATURAL_SELECTION/common/view/NaturalSelectionTimeControlNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PedigreeControlPanel = require( 'NATURAL_SELECTION/common/view/PedigreeControlPanel' );
  const PedigreeNode = require( 'NATURAL_SELECTION/common/view/PedigreeNode' );
  const PopulationControlPanel = require( 'NATURAL_SELECTION/common/view/PopulationControlPanel' );
  const PopulationGraphNode = require( 'NATURAL_SELECTION/common/view/PopulationGraphNode' );
  const ProportionControlPanel = require( 'NATURAL_SELECTION/common/view/ProportionControlPanel' );
  const ProportionGraphNode = require( 'NATURAL_SELECTION/common/view/ProportionGraphNode' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const SelectionAgentsPanel = require( 'NATURAL_SELECTION/common/view/SelectionAgentsPanel' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const ViewportNode = require( 'NATURAL_SELECTION/common/view/ViewportNode' );

  class NaturalSelectionScreenView extends ScreenView {

    /**
     * @param {NaturalSelectionModel} model
     * @param {NaturalSelectionViewProperties} viewProperties
     * @param {{label:string, property:Property.<Boolean>}[]} traits
     * @param {{label:string, property:Property.<Boolean>}[]} alleles
     * @param {Tandem} tandem
     */
    constructor( model, viewProperties, traits, alleles, tandem ) {

      super( {
        tandem: tandem
      } );

      const viewportNode = new ViewportNode( model.abioticEnvironmentProperty,
        0.75 * this.layoutBounds.width, 0.5 * this.layoutBounds.height, {
          left: this.layoutBounds.left + NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN,
          top: this.layoutBounds.top + NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN
        } );

      const limitedFoodCheckbox = new LimitedFoodCheckbox( model.limitFoodProperty, {
        left: viewportNode.left + NaturalSelectionConstants.VIEWPORT_NODE_X_MARGIN,
        top: viewportNode.top + NaturalSelectionConstants.VIEWPORT_NODE_Y_MARGIN
      } );

      const generationClockNode = new GenerationClockNode( model.generationClock, {
        visible: false, // invisible until 'Add a Mate' button is pressed
        centerX: viewportNode.centerX,
        top: viewportNode.top + NaturalSelectionConstants.VIEWPORT_NODE_Y_MARGIN
      } );

      const abioticEnvironmentRadioButtonGroup = new AbioticEnvironmentRadioButtonGroup( model.abioticEnvironmentProperty, {
        right: viewportNode.right - NaturalSelectionConstants.VIEWPORT_NODE_X_MARGIN,
        top: viewportNode.top + NaturalSelectionConstants.VIEWPORT_NODE_Y_MARGIN
      } );

      const addAMateButton = new AddAMateButton( {
        listener: () => this.addAMate(),
        centerX: viewportNode.centerX,
        bottom: viewportNode.bottom - NaturalSelectionConstants.VIEWPORT_NODE_Y_MARGIN
      } );

      const mutationComingNode = new MutationComingNode( {
        cancelButtonListener: () => this.cancelMutation(),
        visible: false,
        centerX: viewportNode.centerX,
        bottom: viewportNode.bottom - NaturalSelectionConstants.VIEWPORT_NODE_Y_MARGIN
      } );

      const rightOfWorldWidth = this.layoutBounds.width - viewportNode.width -
                                 ( 2 * NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN ) -
                                 NaturalSelectionConstants.SCREEN_VIEW_X_SPACING;

      const addMutationPanel = new AddMutationPanel( {
        fixedWidth: rightOfWorldWidth,
        left: viewportNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
        top: viewportNode.top
      } );

      const selectionAgentsPanel = new SelectionAgentsPanel( model.selectionAgents, {
        fixedWidth: rightOfWorldWidth,
        left: viewportNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
        bottom: viewportNode.bottom
      } );

      const graphWidth = 0.75 * viewportNode.width;
      const graphHeight = this.layoutBounds.height - ( 2 * NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN ) -
                          viewportNode.height - NaturalSelectionConstants.SCREEN_VIEW_Y_SPACING;

      const leftOfGraphWidth = viewportNode.width - graphWidth - NaturalSelectionConstants.SCREEN_VIEW_X_SPACING;

      const populationGraphNode = new PopulationGraphNode( graphWidth, graphHeight, {
        right: viewportNode.right,
        top: viewportNode.bottom + NaturalSelectionConstants.SCREEN_VIEW_Y_SPACING
      } );

      const populationControlPanel = new PopulationControlPanel(
        viewProperties.populationTotalVisibleProperty,
        viewProperties.populationValuesMarkerVisibleProperty,
        traits, {
          fixedWidth: leftOfGraphWidth,
          maxHeight: graphHeight,
          right: populationGraphNode.left - NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN,
          centerY: populationGraphNode.centerY
        } );

      const populationParent = new Node( {
        children: [ populationControlPanel, populationGraphNode ]
      } );

      const proportionGraphNode = new ProportionGraphNode( graphWidth, graphHeight, {
        right: viewportNode.right,
        top: viewportNode.bottom + NaturalSelectionConstants.SCREEN_VIEW_Y_SPACING
      } );

      const proportionControlPanel = new ProportionControlPanel(
        viewProperties.proportionValuesVisibleProperty,
        traits, {
          fixedWidth: leftOfGraphWidth,
          maxHeight: graphHeight,
          right: proportionGraphNode.left - NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN,
          centerY: proportionGraphNode.centerY
        } );

      const proportionParent = new Node( {
        children: [ proportionControlPanel, proportionGraphNode ]
      } );

      const pedigreeNode = new PedigreeNode( graphWidth, graphHeight, {
        right: viewportNode.right,
        top: viewportNode.bottom + NaturalSelectionConstants.SCREEN_VIEW_Y_SPACING
      } );

      const pedigreeControlPanel = new PedigreeControlPanel(
        alleles, {
          fixedWidth: leftOfGraphWidth,
          maxHeight: graphHeight,
          right: pedigreeNode.left - NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN,
          centerY: pedigreeNode.centerY
        } );

      const pedigreeParent = new Node( {
        children: [ pedigreeControlPanel, pedigreeNode ]
      } );

      const graphRadioButtonGroup = new GraphRadioButtonGroup( viewProperties.graphProperty, {
        maxWidth: rightOfWorldWidth,
        left: populationGraphNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
        centerY: populationGraphNode.centerY
      } );

      const timeControlNode = new NaturalSelectionTimeControlNode( model.isPlayingProperty, {
        left: proportionGraphNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
        bottom: this.layoutBounds.bottom - NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN
      } );

      const resetAllButton = new ResetAllButton( {
        listener: () => {
          this.interruptSubtreeInput();
          model.reset();
          this.reset();
        },
        right: this.layoutBounds.right - NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN,
        bottom: this.layoutBounds.bottom - NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN,
        tandem: tandem.createTandem( 'resetAllButton' )
      } );

      // layering
      this.children = [
        viewportNode,
        limitedFoodCheckbox,
        generationClockNode,
        abioticEnvironmentRadioButtonGroup,
        addAMateButton,
        mutationComingNode,
        addMutationPanel,
        selectionAgentsPanel,
        timeControlNode,
        populationParent,
        proportionParent,
        pedigreeParent,
        graphRadioButtonGroup,
        resetAllButton
      ];

      // @private
      this.model = model;
      this.generationClockNode = generationClockNode;
      this.addAMateButton = addAMateButton;
      this.mutationComingNode = mutationComingNode;

      viewProperties.graphProperty.link( graph => {
        populationParent.visible = ( graph === Graphs.POPULATION );
        proportionParent.visible = ( graph === Graphs.PROPORTION );
        pedigreeParent.visible = ( graph === Graphs.PEDIGREE );
      } );
    }

    /**
     * @public
     */
    reset() {
      this.generationClockNode.visible = false;
      this.addAMateButton.visible = true;
      this.mutationComingNode.visible = false;
      //TODO
    }

    /**
     * @param {number} dt - time step, in seconds
     * @public
     */
    step( dt ) {
      //TODO
    }

    /**
     * Adds a mate.
     * @private
     */
    addAMate() {

      // model
      this.model.mateWasAddedProperty.value = true;

      // view
      this.addAMateButton.visible = false;
      this.generationClockNode.visible = true;
      this.mutationComingNode.visible = true; //TODO not correct, just for testing
    }

    /**
     * Cancels a scheduled mutation.
     * @private
     */
    cancelMutation() {
      this.mutationComingNode.visible = false;
      //TODO
    }
  }

  return naturalSelection.register( 'NaturalSelectionScreenView', NaturalSelectionScreenView );
} );