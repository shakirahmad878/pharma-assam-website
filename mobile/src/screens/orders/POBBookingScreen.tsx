import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { colors, typography, spacing, radius } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { OrderService } from '../../services/orderService';
import { LocationService } from '../../services/location/locationService';
import { AuthService } from '../../services/authService';
import { Product, CartItem, Chemist } from '../../types';
import { CHEMISTS_MOCK } from '../../constants/mockData';

interface POBBookingScreenProps {
  onBack: () => void;
  onOrderSuccess: () => void;
}

export const POBBookingScreen: React.FC<POBBookingScreenProps> = ({ onBack, onOrderSuccess }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [chemists] = useState<Chemist[]>(CHEMISTS_MOCK);
  const [selectedChemist, setSelectedChemist] = useState<Chemist>(CHEMISTS_MOCK[0]);
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    OrderService.getProducts().then(setProducts);
  }, []);

  const handleUpdateQuantity = (product: Product, delta: number) => {
    setCart(prev => {
      const existing = prev[product.id];
      const newQty = (existing?.quantity || 0) + delta;

      if (newQty <= 0) {
        const copy = { ...prev };
        delete copy[product.id];
        return copy;
      }

      const freeQuantity = Math.floor(newQty / 10); // 10+1 free trade scheme bonus
      return {
        ...prev,
        [product.id]: {
          product,
          quantity: newQty,
          freeQuantity,
          rate: product.ptr,
          itemTotal: newQty * product.ptr,
        },
      };
    });
  };

  const cartItems = Object.values(cart);
  const subTotal = cartItems.reduce((acc, item) => acc + item.itemTotal, 0);
  const totalGst = cartItems.reduce(
    (acc, item) => acc + (item.itemTotal * (item.product.gstRate ?? 5)) / 100,
    0
  );
  const grandTotal = subTotal + totalGst;

  const handleSubmitOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Please add at least one product before submitting the POB order.');
      return;
    }

    setSubmitting(true);
    const loc = await LocationService.getCurrentLocation();
    if (loc && loc.isMockLocation) {
      LocationService.validateAuthenticGps(loc, 'POB Order Booking');
      setSubmitting(false);
      return;
    }

    const currentUser = AuthService.getCurrentUser();
    const stockistName = selectedChemist.district
      ? `${selectedChemist.district} Pharma Stockist`
      : 'Valley Pharma Distributors';
    const territory = selectedChemist.area || currentUser?.headquarter || 'Assam Division';

    await OrderService.createOrder({
      buyerType: 'CHEMIST',
      buyerId: selectedChemist.id,
      buyerName: selectedChemist.shopName,
      stockistName,
      territory,
      items: cartItems,
      latitude: loc?.latitude || selectedChemist.latitude,
      longitude: loc?.longitude || selectedChemist.longitude,
    });

    setSubmitting(false);
    Alert.alert(
      'Order Booked',
      `Secondary sales order for ₹${grandTotal.toFixed(2)} booked for ${selectedChemist.shopName} and queued for sync.`,
      [{ text: 'OK', onPress: onOrderSuccess }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="POB Order Booking"
        subtitle="New Life Care Laboratories Pvt Ltd (5% GST)"
        showBack
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Retail Chemist Selector */}
        <Card style={styles.chemistCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionTitle}>Select Retail Chemist</Text>
            <Badge label={`${selectedChemist.district || 'Assam'}`} variant="muted" />
          </View>
          <View style={styles.chemistsList}>
            {chemists.map(c => (
              <TouchableOpacity
                key={c.id}
                style={[styles.chemChip, selectedChemist.id === c.id && styles.chemChipActive]}
                onPress={() => setSelectedChemist(c)}
              >
                <Text style={[styles.chemChipText, selectedChemist.id === c.id && styles.chemChipTextActive]}>
                  {c.shopName}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Product Catalog & Quantity Controls */}
        <View style={styles.catalogHeader}>
          <Text style={styles.sectionTitle}>Product Price List ({products.length} SKUs)</Text>
          <Text style={styles.catalogSubtitle}>PTR = Price to Retailer | PTS = Price to Stockist</Text>
        </View>

        {products.map(prod => {
          const inCart = cart[prod.id];
          return (
            <Card key={prod.id} style={styles.prodCard}>
              <View style={styles.prodRow}>
                <View style={{ flex: 1, paddingRight: spacing.sm }}>
                  <View style={styles.titleBadgeRow}>
                    <Text style={styles.brandName}>{prod.brandName}</Text>
                    <View style={styles.formBadge}>
                      <Text style={styles.formBadgeText}>{prod.dosageForm}</Text>
                    </View>
                  </View>
                  <Text style={styles.genName}>{prod.genericName}</Text>

                  {/* Pricing grid */}
                  <View style={styles.pricingGrid}>
                    <View style={styles.priceItem}>
                      <Text style={styles.priceLabel}>PTR</Text>
                      <Text style={styles.ptrValue}>₹{prod.ptr.toFixed(2)}</Text>
                    </View>
                    <View style={styles.priceDivider} />
                    <View style={styles.priceItem}>
                      <Text style={styles.priceLabel}>PTS</Text>
                      <Text style={styles.ptsValue}>₹{prod.pts.toFixed(2)}</Text>
                    </View>
                    <View style={styles.priceDivider} />
                    <View style={styles.priceItem}>
                      <Text style={styles.priceLabel}>MRP</Text>
                      <Text style={styles.mrpValue}>₹{prod.mrp.toFixed(2)}</Text>
                    </View>
                    <View style={styles.priceDivider} />
                    <View style={styles.priceItem}>
                      <Text style={styles.priceLabel}>GST</Text>
                      <Text style={styles.gstValue}>{prod.gstRate}%</Text>
                    </View>
                  </View>

                  <Text style={styles.scheme}>🎁 Trade Scheme: 10 + 1 Free</Text>
                </View>

                {/* Quantity Controls */}
                <View style={styles.qtyBox}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => handleUpdateQuantity(prod, -1)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.qtyBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyNum}>{inCart?.quantity || 0}</Text>
                  <TouchableOpacity
                    style={[styles.qtyBtn, styles.qtyBtnPlus]}
                    onPress={() => handleUpdateQuantity(prod, 1)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.qtyBtnText, styles.qtyBtnPlusText]}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {inCart && inCart.quantity > 0 && (
                <View style={styles.cartItemNotice}>
                  <Text style={styles.cartItemNoticeText}>
                    Subtotal: ₹{inCart.itemTotal.toFixed(2)}
                    {inCart.freeQuantity > 0 ? ` (+${inCart.freeQuantity} Free Unit Bonus)` : ''}
                  </Text>
                </View>
              )}
            </Card>
          );
        })}

        {/* Order Cart Summary */}
        {cartItems.length > 0 && (
          <Card style={styles.cartCard}>
            <Text style={styles.sectionTitle}>Order Bill Summary</Text>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Subtotal ({cartItems.length} Products):</Text>
              <Text style={styles.billVal}>₹{subTotal.toFixed(2)}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>GST (5%):</Text>
              <Text style={styles.billVal}>₹{totalGst.toFixed(2)}</Text>
            </View>
            <View style={[styles.billRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Payable Amount:</Text>
              <Text style={styles.totalVal}>₹{grandTotal.toFixed(2)}</Text>
            </View>

            <Button
              title={`Confirm & Book Order (₹${grandTotal.toFixed(2)})`}
              onPress={handleSubmitOrder}
              loading={submitting}
              variant="primary"
            />
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  chemistCard: { marginBottom: spacing.md },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  sectionTitle: { color: colors.textPrimary, fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold },
  catalogHeader: { marginTop: spacing.xs, marginBottom: spacing.sm },
  catalogSubtitle: { color: colors.textSecondary, fontSize: typography.fontSize.xs, marginTop: 2 },
  chemistsList: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.xs },
  chemChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chemChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chemChipText: { color: colors.textSecondary, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold },
  chemChipTextActive: { color: colors.textInverse },
  prodCard: { marginBottom: spacing.sm },
  prodRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  titleBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flexWrap: 'wrap' },
  brandName: { color: colors.textPrimary, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold },
  formBadge: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  formBadgeText: { color: colors.textSecondary, fontSize: 10, fontWeight: '700' },
  genName: { color: colors.textSecondary, fontSize: typography.fontSize.xs, marginTop: 2 },
  pricingGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.sm,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 6,
    gap: 8,
  },
  priceItem: { alignItems: 'flex-start' },
  priceLabel: { fontSize: 9, color: colors.textMuted, fontWeight: '600' },
  ptrValue: { color: colors.primary, fontSize: 12, fontWeight: '700' },
  ptsValue: { color: colors.textPrimary, fontSize: 11, fontWeight: '600' },
  mrpValue: { color: colors.textSecondary, fontSize: 11, textDecorationLine: 'line-through' },
  gstValue: { color: colors.success, fontSize: 11, fontWeight: '700' },
  priceDivider: { width: 1, height: 16, backgroundColor: colors.border },
  scheme: { color: colors.success, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold, marginTop: 4 },
  qtyBox: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderDark,
  },
  qtyBtnPlus: { backgroundColor: colors.primary, borderColor: colors.primary },
  qtyBtnText: { color: colors.textPrimary, fontSize: 16, fontWeight: 'bold' },
  qtyBtnPlusText: { color: colors.textInverse },
  qtyNum: { color: colors.textPrimary, fontSize: 16, fontWeight: 'bold', width: 26, textAlign: 'center' },
  cartItemNotice: {
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cartItemNoticeText: { color: colors.primaryDark, fontSize: typography.fontSize.xs, fontWeight: '600' },
  cartCard: { marginTop: spacing.md, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.primary },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 3 },
  billLabel: { color: colors.textSecondary, fontSize: typography.fontSize.sm },
  billVal: { color: colors.textPrimary, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold },
  totalRow: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm, marginVertical: spacing.md },
  totalLabel: { color: colors.textPrimary, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold },
  totalVal: { color: colors.primary, fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.black },
});
