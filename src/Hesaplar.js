import React, { useState } from 'react';
import HesapHareketleri from './HesapHareketleri';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const Hesaplar = ({ accounts }) => {
  const [selectedAccount, setSelectedAccount] = useState(null);

  const handleAccountPress = (account) => {
    setSelectedAccount(account);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hesaplarınız:</Text>
      {selectedAccount ? (
        <HesapHareketleri
          transactions={selectedAccount.transactions}
          accountName={selectedAccount.account.name}
        />
      ) : (
        <FlatList
          data={accounts}
          keyExtractor={(item) => item.account.iban}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleAccountPress(item)}>
              <View style={styles.accountContainer}>
                <Text style={styles.accountName}>{item.account.name}</Text>
                <Text style={styles.iban}>{item.account.iban}</Text>
                <Text style={styles.balance}>
                  Bakiye: {item.balance.amount} {item.balance.currencyCode}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color:'brown',
    marginBottom: 10,
  },
  accountContainer: {
    padding: 10,
    borderWidth: 2,
    borderColor: 'black',
    marginBottom: 10,
  },
  accountName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  iban: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  balance: {
    fontSize: 18,
    marginTop: 5,
    
  },
});

export default Hesaplar;
