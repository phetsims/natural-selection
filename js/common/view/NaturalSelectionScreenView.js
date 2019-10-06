// Copyright 2019, University of Colorado Boulder

/**
 * NaturalSelectionScreenView is the base class for all ScreenViews in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AddAMateButton = require( 'NATURAL_SELECTION/common/view/AddAMateButton' );
  const AddMutationPanel = require( 'NATURAL_SELECTION/common/view/AddMutationPanel' );
  const ClimateRadioButtonGroup = require( 'NATURAL_SELECTION/common/view/ClimateRadioButtonGroup' );
  const GraphRadioButtonGroup = require( 'NATURAL_SELECTION/common/view/GraphRadioButtonGroup' );
  const Graphs = require( 'NATURAL_SELECTION/common/view/Graphs' );
  const LimitedFoodCheckbox = require( 'NATURAL_SELECTION/common/view/LimitedFoodCheckbox' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const NaturalSelectionTimeControlNode = require( 'NATURAL_SELECTION/common/view/NaturalSelectionTimeControlNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PedigreeControlPanel = require( 'NATURAL_SELECTION/common/view/PedigreeControlPanel' );
  const PedigreeGraphNode = require( 'NATURAL_SELECTION/common/view/PedigreeGraphNode' );
  const PopulationControlPanel = require( 'NATURAL_SELECTION/common/view/PopulationControlPanel' );
  const PopulationGraphNode = require( 'NATURAL_SELECTION/common/view/PopulationGraphNode' );
  const ProportionControlPanel = require( 'NATURAL_SELECTION/common/view/ProportionControlPanel' );
  const ProportionGraphNode = require( 'NATURAL_SELECTION/common/view/ProportionGraphNode' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const SelectionAgentsPanel = require( 'NATURAL_SELECTION/common/view/SelectionAgentsPanel' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const WorldNode = require( 'NATURAL_SELECTION/common/view/WorldNode' );

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

      const worldNode = new WorldNode( 0.75 * this.layoutBounds.width, 0.5 * this.layoutBounds.height, {
        left: this.layoutBounds.left + NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN,
        top: this.layoutBounds.top + NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN
      } );

      const limitedFoodCheckbox = new LimitedFoodCheckbox( model.limitFoodProperty, {
        left: worldNode.left + NaturalSelectionConstants.WORLD_NODE_X_MARGIN,
        top: worldNode.top + NaturalSelectionConstants.WORLD_NODE_Y_MARGIN
      } );

      const climateRadioButtonGroup = new ClimateRadioButtonGroup( model.climateProperty, {
        right: worldNode.right - NaturalSelectionConstants.WORLD_NODE_X_MARGIN,
        top: worldNode.top + NaturalSelectionConstants.WORLD_NODE_Y_MARGIN
      } );

      const addAMateButton = new AddAMateButton( {
        listener: () => {
          this.addAMateButton.visible = false;
          //TODO
        },
        centerX: worldNode.centerX,
        bottom: worldNode.bottom - NaturalSelectionConstants.WORLD_NODE_Y_MARGIN
      } );

      const addMutationPanel = new AddMutationPanel( {
        left: worldNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
        top: worldNode.top
      } );

      const selectionAgentsPanel = new SelectionAgentsPanel( model.selectionAgents, {
        left: worldNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
        bottom: worldNode.bottom
      } );

      const timeControlNode = new NaturalSelectionTimeControlNode( model.isPlayingProperty, {
        centerX: worldNode.right + ( this.layoutBounds.right - worldNode.right ) / 2,
        centerY: worldNode.bottom + ( this.layoutBounds.bottom - worldNode.bottom ) / 2
      } );

      const graphRadioButtonGroup = new GraphRadioButtonGroup( viewProperties.graphProperty, {
        left: worldNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
        bottom: this.layoutBounds.bottom - NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN
      } );

      const graphWidth = 0.75 * worldNode.width;
      const graphHeight = this.layoutBounds.height - ( 2 * NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN ) -
                          worldNode.height - NaturalSelectionConstants.SCREEN_VIEW_Y_SPACING;

      const populationControlPanel = new PopulationControlPanel(
        viewProperties.populationTotalVisibleProperty,
        viewProperties.populationValuesMarkerVisibleProperty,
        traits, {
          left: this.layoutBounds.left + NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN,
          top: worldNode.bottom + NaturalSelectionConstants.SCREEN_VIEW_Y_SPACING
        } );

      const populationGraphNode = new PopulationGraphNode( graphWidth, graphHeight, {
        right: worldNode.right,
        top: populationControlPanel.top
      } );

      const populationParent = new Node( {
        children: [ populationControlPanel, populationGraphNode ]
      } );

      const proportionControlPanel = new ProportionControlPanel(
        viewProperties.proportionValuesVisibleProperty,
        traits, {
          left: this.layoutBounds.left + NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN,
          top: worldNode.bottom + NaturalSelectionConstants.SCREEN_VIEW_Y_SPACING
        } );

      const proportionGraphNode = new ProportionGraphNode( graphWidth, graphHeight, {
        right: worldNode.right,
        top: populationControlPanel.top
      } );

      const proportionParent = new Node( {
        children: [ proportionControlPanel, proportionGraphNode ]
      } );

      const pedigreeControlPanel = new PedigreeControlPanel(
        alleles, {
          left: this.layoutBounds.left + NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN,
          top: worldNode.bottom + NaturalSelectionConstants.SCREEN_VIEW_Y_SPACING
        } );

      const pedigreeGraphNode = new PedigreeGraphNode( graphWidth, graphHeight, {
        right: worldNode.right,
        top: populationControlPanel.top
      } );

      const pedigreeParent = new Node( {
        children: [ pedigreeControlPanel, pedigreeGraphNode ]
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
        worldNode,
        limitedFoodCheckbox,
        climateRadioButtonGroup,
        addAMateButton,
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
      this.addAMateButton = addAMateButton;

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
      this.addAMateButton.visible = true;
      //TODO
    }

    /**
     * @param {number} dt - time step, in seconds
     * @public
     */
    step( dt ) {
      //TODO
    }
  }

  return naturalSelection.register( 'NaturalSelectionScreenView', NaturalSelectionScreenView );
} );