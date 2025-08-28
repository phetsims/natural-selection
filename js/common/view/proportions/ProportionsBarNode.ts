// Copyright 2019-2025, University of Colorado Boulder

/**
 * ProportionsBarNode is a bar in the Proportions graph, showing the percentage of mutant vs non-mutant alleles for
 * a gene in the population.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../../axon/js/Multilink.js';
import Property from '../../../../../axon/js/Property.js';
import StringProperty from '../../../../../axon/js/StringProperty.js';
import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import Utils from '../../../../../dot/js/Utils.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import Node, { NodeOptions } from '../../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import TColor from '../../../../../scenery/js/util/TColor.js';
import naturalSelection from '../../../naturalSelection.js';
import NaturalSelectionStrings from '../../../NaturalSelectionStrings.js';
import NaturalSelectionUtils from '../../NaturalSelectionUtils.js';
import HatchingRectangle from '../HatchingRectangle.js';

const PERCENTAGE_OPTIONS = {
  font: new PhetFont( 12 ),
  bottom: -4,
  maxWidth: 40 // determined empirically
};

type SelfOptions = {
  barWidth?: number;
  barHeight?: number;
};

type ProportionsBarNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class ProportionsBarNode extends Node {

  private readonly valuesVisibleProperty: TReadOnlyProperty<boolean>;
  private readonly normalRectangle: Rectangle;
  private readonly mutantRectangle: Rectangle;
  private readonly normalPercentageStringProperty: Property<string>;
  private readonly mutantPercentageStringProperty: Property<string>;
  private readonly normalPercentageText: Text;
  private readonly mutantPercentageText: Text;
  private readonly barWidth: number;
  private normalCount: number;
  private mutantCount: number;

  public constructor( color: TColor, normalCount: number, mutantCount: number,
                      valuesVisibleProperty: TReadOnlyProperty<boolean>,
                      providedOptions: ProportionsBarNodeOptions ) {

    const options = optionize<ProportionsBarNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      barWidth: 120,
      barHeight: 30,

      // NodeOptions
      phetioReadOnly: true,
      isDisposable: false
    }, providedOptions );

    // Portions of the bar for normal and mutant counts. normalRectangle remains a fixed size. mutantRectangle
    // will be resized and is on top of normalRectangle.
    const normalRectangle = new Rectangle( 0, 0, options.barWidth, options.barHeight, {
      fill: color,
      stroke: color
    } );
    const mutantRectangle = new HatchingRectangle( 0, 0, options.barWidth, options.barHeight, {
      fill: color,
      stroke: color
    } );

    // Percentage for non-mutant (normal) count.
    const normalPercentageStringProperty = new StringProperty( '', {
      tandem: options.tandem.createTandem( 'normalPercentageStringProperty' ),
      phetioReadOnly: true // value set by Multilink below
    } );
    const normalPercentageText = new Text( normalPercentageStringProperty, PERCENTAGE_OPTIONS );

    // Percentage for mutant count.
    const mutantPercentageStringProperty = new StringProperty( '', {
      tandem: options.tandem.createTandem( 'mutantPercentageStringProperty' ),
      phetioReadOnly: true // value set by Multilink below
    } );
    const mutantPercentageText = new Text( mutantPercentageStringProperty, PERCENTAGE_OPTIONS );

    options.children = [ normalRectangle, mutantRectangle, normalPercentageText, mutantPercentageText ];

    super( options );

    this.valuesVisibleProperty = valuesVisibleProperty;
    this.normalRectangle = normalRectangle;
    this.mutantRectangle = mutantRectangle;
    this.normalPercentageStringProperty = normalPercentageStringProperty;
    this.mutantPercentageStringProperty = mutantPercentageStringProperty;
    this.normalPercentageText = normalPercentageText;
    this.mutantPercentageText = mutantPercentageText;
    this.barWidth = options.barWidth;
    this.normalCount = normalCount;
    this.mutantCount = mutantCount;

    // When valuesVisibleProperty changes, or any of the related strings change, update the display.
    // unlink is not necessary.
    Multilink.multilink( [
        this.valuesVisibleProperty,
        NaturalSelectionStrings.greaterThanValuePercentStringProperty,
        NaturalSelectionStrings.lessThanValuePercentStringProperty,
        NaturalSelectionStrings.valuePercentStringProperty
      ],
      () => this.updateProportionsBarNode()
    );
  }

  /**
   * Sets the counts and triggers an update of the display.
   */
  public setCounts( normalCount: number, mutantCount: number ): void {
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( normalCount ), 'invalid normalCount' );
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( mutantCount ), 'invalid mutantCount' );

    this.normalCount = normalCount;
    this.mutantCount = mutantCount;
    this.updateProportionsBarNode();
  }

  /**
   * Resizes the bars and displays the counts as percentages.
   */
  private updateProportionsBarNode(): void {

    const total = this.normalCount + this.mutantCount;

    const normalPercentage = 100 * this.normalCount / total;
    const mutantPercentage = 100 * this.mutantCount / total;

    // hide zero-length bar
    this.normalRectangle.visible = ( normalPercentage > 0 );
    this.mutantRectangle.visible = ( mutantPercentage > 0 );

    // hide N% values, when values are not visible, or when values are zero
    this.normalPercentageText.visible = ( this.valuesVisibleProperty.value && normalPercentage > 0 );
    this.mutantPercentageText.visible = ( this.valuesVisibleProperty.value && mutantPercentage > 0 );

    // update the mutant portion of the bar and the N% values
    if ( mutantPercentage > 0 && mutantPercentage < 1 ) {

      // 1% mutant
      this.mutantRectangle.rectWidth = 0.01 * this.barWidth;

      // > 99% non-mutant, < 1% mutant
      this.normalPercentageStringProperty.value = StringUtils.fillIn( NaturalSelectionStrings.greaterThanValuePercentStringProperty.value, { value: 99 } );
      this.mutantPercentageStringProperty.value = StringUtils.fillIn( NaturalSelectionStrings.lessThanValuePercentStringProperty.value, { value: 1 } );
    }
    else if ( normalPercentage > 0 && normalPercentage < 1 ) {

      // 99% mutant
      this.mutantRectangle.rectWidth = 0.99 * this.barWidth;

      // < 1% non-mutant, > 99% mutant
      this.normalPercentageStringProperty.value = StringUtils.fillIn( NaturalSelectionStrings.lessThanValuePercentStringProperty.value, { value: 1 } );
      this.mutantPercentageStringProperty.value = StringUtils.fillIn( NaturalSelectionStrings.greaterThanValuePercentStringProperty.value, { value: 99 } );
    }
    else {

      if ( this.mutantRectangle.visible ) {
        this.mutantRectangle.rectWidth = ( Utils.roundSymmetric( mutantPercentage ) / 100 ) * this.barWidth;
      }
      else {
        this.mutantRectangle.rectWidth = 1; // small non-zero, for layout
      }

      // round both percentages to the nearest integer
      this.normalPercentageStringProperty.value = StringUtils.fillIn( NaturalSelectionStrings.valuePercentStringProperty.value, {
        value: Utils.roundSymmetric( normalPercentage )
      } );
      this.mutantPercentageStringProperty.value = StringUtils.fillIn( NaturalSelectionStrings.valuePercentStringProperty.value, {
        value: Utils.roundSymmetric( mutantPercentage )
      } );
    }
    this.mutantRectangle.right = this.normalRectangle.right;

    // center N% above its portion of the bar
    if ( normalPercentage > 0 ) {
      this.normalPercentageText.centerX = ( normalPercentage / 100 ) * ( this.barWidth / 2 );
    }
    if ( mutantPercentage > 0 ) {
      this.mutantPercentageText.centerX = this.barWidth - ( ( mutantPercentage / 100 ) * ( this.barWidth / 2 ) );
    }

    // horizontally constrain N% to left and right edges of bars
    if ( this.normalPercentageText.left < this.normalRectangle.left ) {
      this.normalPercentageText.left = this.normalRectangle.left;
    }
    else if ( this.normalPercentageText.right > this.normalRectangle.right ) {
      this.normalPercentageText.right = this.normalRectangle.right;
    }

    if ( this.mutantPercentageText.left < this.normalRectangle.left ) {
      this.mutantPercentageText.left = this.normalRectangle.left;
    }
    else if ( this.mutantPercentageText.right > this.normalRectangle.right ) {
      this.mutantPercentageText.right = this.normalRectangle.right;
    }
  }
}

naturalSelection.register( 'ProportionsBarNode', ProportionsBarNode );