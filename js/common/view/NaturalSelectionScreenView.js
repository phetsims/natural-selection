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
  const EnvironmentalFactorsPanel = require( 'NATURAL_SELECTION/common/view/EnvironmentalFactorsPanel' );
  const EnvironmentRadioButtonGroup = require( 'NATURAL_SELECTION/common/view/EnvironmentRadioButtonGroup' );
  const GenerationClockNode = require( 'NATURAL_SELECTION/common/view/GenerationClockNode' );
  const GraphRadioButtonGroup = require( 'NATURAL_SELECTION/common/view/GraphRadioButtonGroup' );
  const Graphs = require( 'NATURAL_SELECTION/common/view/Graphs' );
  const MutationComingNode = require( 'NATURAL_SELECTION/common/view/MutationComingNode' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PedigreeNode = require( 'NATURAL_SELECTION/common/view/pedigree/PedigreeNode' );
  const PopulationNode = require( 'NATURAL_SELECTION/common/view/population/PopulationNode' );
  const ProportionsNode = require( 'NATURAL_SELECTION/common/view/proportions/ProportionsNode' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const TimeControlNode = require( 'SCENERY_PHET/TimeControlNode' );
  const ViewportNode = require( 'NATURAL_SELECTION/common/view/ViewportNode' );

  class NaturalSelectionScreenView extends ScreenView {

    /**
     * @param {NaturalSelectionModel} model
     * @param {NaturalSelectionViewProperties} viewProperties
     * @param {Tandem} tandem
     */
    constructor( model, viewProperties, tandem ) {

      super( {
        tandem: tandem
      } );

      const viewportNode = new ViewportNode( model.environmentProperty, {
        left: this.layoutBounds.left + NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN,
        top: this.layoutBounds.top + NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN
      } );

      const generationClockNode = new GenerationClockNode( model.generationClock, model.selectionAgentsEnabledProperty, {
        centerX: viewportNode.centerX,
        top: viewportNode.top + NaturalSelectionConstants.VIEWPORT_NODE_Y_MARGIN
      } );

      const environmentRadioButtonGroup = new EnvironmentRadioButtonGroup( model.environmentProperty, {
        right: viewportNode.right - NaturalSelectionConstants.VIEWPORT_NODE_X_MARGIN,
        top: viewportNode.top + NaturalSelectionConstants.VIEWPORT_NODE_Y_MARGIN
      } );

      const addAMateButton = new AddAMateButton( {
        listener: () => this.addAMate(),
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

      //TODO for demo purposes only
      const mutationComingXOffset = -5;
      const mutationComingParent = new Node( {
        children: [

          // Fur
          new MutationComingNode( {
            rightCenter: addMutationPanel.getFurLeftCenter().addXY( mutationComingXOffset, 0 )
          } ),

          // Ears
          new MutationComingNode( {
            rightCenter: addMutationPanel.getEarsLeftCenter().addXY( mutationComingXOffset, 0 )
          } ),

          // Teeth
          new MutationComingNode( {
            rightCenter: addMutationPanel.getTeethLeftCenter().addXY( mutationComingXOffset, 0 )
          } )
        ]
      } );

      const environmentalFactorsPanel = new EnvironmentalFactorsPanel(
        model.wolves.enabledProperty, model.toughFood.enabledProperty, model.limitedFood.enabledProperty, {
          fixedWidth: rightOfWorldWidth,
          left: viewportNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
          top: addMutationPanel.bottom + NaturalSelectionConstants.SCREEN_VIEW_Y_SPACING
        } );

      const graphWidth = 0.75 * viewportNode.width;
      const graphHeight = this.layoutBounds.height - ( 2 * NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN ) -
                          viewportNode.height - NaturalSelectionConstants.SCREEN_VIEW_Y_SPACING;

      // Options common to the Population, Proportion, and Pedigree views
      const viewOptions = {

        // Control panels occupy the space to the left of graphs
        controlPanelWidth: viewportNode.width - graphWidth - NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
        controlPanelHeight: graphHeight,
        graphWidth: graphWidth,
        graphHeight: graphHeight,
        right: viewportNode.right,
        top: viewportNode.bottom + NaturalSelectionConstants.SCREEN_VIEW_Y_SPACING
      };

      const populationNode = new PopulationNode( model.populationModel, viewOptions );
      const proportionsNode = new ProportionsNode( model.proportionModel, viewOptions );
      const pedigreeNode = new PedigreeNode( model.pedigreeModel, viewOptions );

      const graphRadioButtonGroup = new GraphRadioButtonGroup( viewProperties.graphProperty, {
        maxWidth: rightOfWorldWidth,
        left: viewportNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
        centerY: populationNode.centerY
      } );

      const timeControlNode = new TimeControlNode( model.isPlayingProperty, {
        stepOptions: {
          listener: () => model.stepOnce( NaturalSelectionConstants.SECONDS_PER_STEP )
        },
        left: viewportNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
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
        generationClockNode,
        environmentRadioButtonGroup,
        addAMateButton,
        addMutationPanel,
        environmentalFactorsPanel,
        timeControlNode,
        populationNode,
        proportionsNode,
        pedigreeNode,
        graphRadioButtonGroup,
        resetAllButton,
        mutationComingParent
      ];

      // @private
      this.model = model;
      this.addAMateButton = addAMateButton;

      viewProperties.graphProperty.link( graph => {
        populationNode.visible = ( graph === Graphs.POPULATION );
        proportionsNode.visible = ( graph === Graphs.PROPORTIONS );
        pedigreeNode.visible = ( graph === Graphs.PEDIGREE );
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

    /**
     * Adds a mate.
     * @private
     */
    addAMate() {

      // model
      this.model.mateWasAddedProperty.value = true;

      // view
      this.addAMateButton.visible = false;
    }

    /**
     * Cancels a scheduled mutation.
     * @private
     */
    cancelMutation() {
      //TODO
    }
  }

  return naturalSelection.register( 'NaturalSelectionScreenView', NaturalSelectionScreenView );
} );