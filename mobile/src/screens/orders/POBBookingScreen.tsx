import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, FlatList, TouchableOpacity, Alert } from 'react-native';
import { colors, typography, spacing, radius } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { OrderService } from '../../services/orderService';
import { LocationService } from '../../services/location/locationService';
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
          itemTotal: newQty * product.ptr
        }
      };
    });
  };

  const cartItems = Object.values(cart);
  const subTotal = cartItems.reduce((acc, item) => acc + item.itemTotal, 0);
  const totalGst = subTotal * 0.12; // 12% GST
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

    await OrderService.createOrder({
      buyerType: 'CHEMIST',
      buyerId: selectedChemist.id,
      buyerName: selectedChemist.shopName,
      stockistName: 'Mahavir Pharma Distributors',
      territory: 'Bandra West',
      items: cartItems,
      latitude: loc?.latitude || selectedChemist.latitude,
      longitude: loc?.longitude || selectedChemist.longitude
    });

    setSubmitting(false);
    Alert.alert('Order Booked', `Secondary sales order for ₹${grandTotal.toFixed(2)} booked and queued for sync.`, [
      { text: 'OK', onPress: onOrderSuccess }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="POB Order Booking" subtitle="Secondary Sales & Scheme Calculation" showBack onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Retail Chemist Selector */}
        <Card>
          <Text style={styles.sectionTitle}>Select Retail Chemist</Text>
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
        <Text style={styles.sectionTitle}>Product Catalog (PTR Pricing)</Text>
        {products.map(prod => {
          const inCart = cart[prod.id];
          return (
            <Card key={prod.id} style={styles.prodCard}>
              <View style={styles.prodRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.brandName}>{prod.brandName}</Text>
                  <Text style={styles.genName}>{prod.genericName}</Text>
                  <Text style={styles.pricing}>
                    PTR: ₹{prod.ptr.toFixed(2)} / {prod.packSize} • MRP: ₹{prod.mrp.toFixed(2)}
                  </Text>
                  <Text style={styles.scheme}>🎁 Scheme: 10 + 1 Free</Text>
                </View>

                {/* Quantity Controls */}
                <View style={styles.qtyBox}>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => handleUpdateQuantity(prod, -1)}>
                    <Text style={styles.qtyBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyNum}>{inCart?.quantity || 0}</Text>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => handleUpdateQuantity(prod, 1)}>
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
              <Text style={styles.billLabel}>GST (12%):</Text>
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
  sectionTitle: { color: colors.textPrimary, fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, marginBottom: spacing.sm },
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
  brandName: { color: colors.textPrimary, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold },
  genName: { color: colors.textSecondary, fontSize: typography.fontSize.xs, marginTop: 2 },
  pricing: { color: colors.primaryDark, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold, marginTop: 4 },
  scheme: { color: colors.success, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold, marginTop: 2 },
  qtyBox: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
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
  qtyBtnText: { color: colors.textPrimary, fontSize: 16, fontWeight: 'bold' },
  qtyNum: { color: colors.textPrimary, fontSize: 16, fontWeight: 'bold', width: 24, textAlign: 'center' },
  cartCard: { marginTop: spacing.md, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.primary },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 3 },
  billLabel: { color: colors.textSecondary, fontSize: typography.fontSize.sm },
  billVal: { color: colors.textPrimary, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold },
  totalRow: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm, marginVertical: spacing.md },
  totalLabel: { color: colors.textPrimary, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold },
  totalVal: { color: colors.primary, fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.black },
});
