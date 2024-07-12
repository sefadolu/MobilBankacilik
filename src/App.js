import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import base64 from 'react-native-base64';
import Hesaplar from './Hesaplar';
import HesapHareketleri from './HesapHareketleri';

const App = () => {
  const [webViewVisible, setWebViewVisible] = useState(false);
  const [code, setCode] = useState(null);
  const [access_token, setAccessToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [xData, setXData] = useState([]);
  const [startDate, setStartDate] = useState('18.01.2023');
  const [endDate, setEndDate] = useState('07.09.2023');
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  useEffect(() => {
    if (access_token) {
      fetchData();
    }
  }, [access_token]);

  const openWebPage = () => {
    setWebViewVisible(true);
  };

  const goBack = () => {
    setWebViewVisible(false);
  };

  const handleNavigation = (navState) => {
    const { url } = navState;

    if (url.includes('http://localhost/myfirstapp?code=')) {
      const codeStartIndex = url.indexOf('code=') + 5;
      const codeEndIndex = url.indexOf('&state=');
      if (codeEndIndex !== -1) {
        const codeValue = url.substring(codeStartIndex, codeEndIndex);
        setCode(codeValue);
        setWebViewVisible(false);

        getToken(codeValue);
      }
    }
  };

  const getToken = async (code) => {
    const tokenUrl =
      'https://apitest.albarakaturk.com.tr/ocf-auth-server/auth/oauth/token';
    const clientId = 'pwi3n9388hsyr7ytjnhdp9949mumlouq';
    const clientSecret =
      'K136ZBfOzi%#t6D=N*VP6DoJf9zU2yRdVw*dmHywEQTrSQ#WPZkOZF7xQVBFuFOP';

    try {
      const formData = new FormData();
      formData.append('grant_type', 'authorization_code');
      formData.append('code', code);

      const authHeader =
        'Basic ' + base64.encode(`${clientId}:${clientSecret}`);

      const response = await axios.post(tokenUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: authHeader,
        },
      });
      const accessTokenValue = response.data.access_token;
      setAccessToken(accessTokenValue);
    } catch (error) {
      console.error('Token alınamadı:', error);
    }
  };

  const fetchData = async () => {
    const apiEndpoint =
      'https://apitest.albarakaturk.com.tr/api/accounts/v2/list';

    try {
      const requestData = {
        context: {
          language: 'tr',
        },
      };
      const response = await axios.post(apiEndpoint, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      });
      const responseData = response.data;
      setUserData(responseData);
    } catch (error) {
      console.error('API isteği başarisiz:', error);
    }
  };

  const fetchMoreData = async (branchCode, number, suffix) => {
    if (!branchCode || !number || !suffix) {
      console.error('Hesap bilgisi eksik.');
      return;
    }
    const moreDataApiEndpoint =
      'https://apitest.albarakaturk.com.tr/api/accounts/v2/account/transactions';

    try {
      const moreRequestData = {
        account: {
          branchCode,
          number,
          suffix,
        },
        context: {
          language: 'tr',
        },
        dateEnd: endDate, 
        dateStart: startDate, 
      };
      
      const moreResponse = await axios.post(moreDataApiEndpoint, moreRequestData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      });

      const moreResponseData = moreResponse.data;
      if (moreResponseData && moreResponseData.data && moreResponseData.data.transactions) {
        setXData([...xData, ...moreResponseData.data.transactions]);
        console.log('API2CEVABI:',moreResponseData);
      } else {
        console.error('API2 isteği başarisiz: Geçersiz veri');
      }
    } catch (error) {
      console.error('API2 isteği başarisiz:', error);
    }
  };


  const handleAccountPress = async (account) => {
    setSelectedAccount(account);
    try {
      const branchCode = account.account.branchCode;
      const number = account.account.number;
      const suffix = account.account.suffix;

    
      const accountData = await fetchMoreData(branchCode, number, suffix);
    } catch (error) {
    
    }
  };

  return (
    <View style={styles.home}>
      {webViewVisible ? (
        <View style={styles.webviewContainer}>
          <WebView
            source={{
              uri:
                'https://testomnichannellogin.albarakaturk.com.tr/?response_type=code&client_id=pwi3n9388hsyr7ytjnhdp9949mumlouq&scope=accounts&redirect_uri=http://localhost/myfirstapp',
            }}
            style={styles.webview}
            onNavigationStateChange={handleNavigation}
          />
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>Geri</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          {userData ? (
            <Hesaplar
              accounts={userData.data.accounts}
              onAccountPress={handleAccountPress}
            />
          ) : (
            <>
              <View style={styles.toolbar}>
                <Text style={styles.toolbarText}>HOME</Text>
              </View>
              <View style={styles.content}>
                <Text style={styles.welcomeText}>Hoş Geldiniz</Text>
                <View style={styles.container}>
                  <Image
                    style={{
                      width: 34,
                      height: 34,
                      borderWidth: 0,
                      borderColor: 'white',
                      marginRight: 3,
                    }}
                    resizeMethod="resize"
                    source={require('./images/albaraka.png')}
                  />
                  <TouchableOpacity
                    onPress={openWebPage}
                    style={styles.buttonContainer}
                  >
                    <Text style={styles.buttonText}>Albaraka Türk</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.listItem}>
                  <Image
                    style={{ width: 37, height: 37, borderWidth: 0, borderColor: 'white', marginRight: 3 }}
                    resizeMethod='resize'
                    source={require('./images/kuveyt.png')}
                  />
                  <TouchableOpacity
                    onPress={() => alert('Henüz Aktif Değil')}
                    style={styles.listButtonContainer}
                  >
                    <Text style={styles.listButtonText}>  Kuveyt Türk   </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.listItem}>
                  <Image
                    style={{ width: 34, height: 34, borderWidth: 0, borderColor: 'white', marginRight: 3 }}
                    resizeMethod='resize'
                    source={require('./images/turkiyefinans.png')}
                  />
                  <TouchableOpacity
                    onPress={() => alert('Henüz Aktif Değil')}
                    style={styles.listButtonContainer}
                  >
                    <Text style={styles.listButtonText}>Türkiye Finans</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.listItem}>
                  <Image
                    style={{ width: 34, height: 34, borderWidth: 0, borderColor: 'white', marginRight: 3 }}
                    resizeMethod='resize'
                    source={require('./images/ziraat.jpg')}
                  />
                  <TouchableOpacity
                    onPress={() => alert('Henüz Aktif Değil')}
                    style={styles.listButtonContainer}
                  >
                    <Text style={styles.listButtonText}>Ziraat Bankası</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.listItem}>
                  <Image
                    style={{ width: 34, height: 34, borderWidth: 0, borderColor: 'white', marginRight: 3 }}
                    resizeMethod='resize'
                    source={require('./images/vakif.png')}
                  />
                  <TouchableOpacity
                    onPress={() => alert('Henüz Aktif Değil')}
                    style={styles.listButtonContainer}
                  >
                    <Text style={styles.listButtonText}>    VakıfBank    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.listItem}>
                  <Image
                    style={{ width: 34, height: 34, borderWidth: 0, borderColor: 'white', marginRight: 3 }}
                    resizeMethod='resize'
                    source={require('./images/halkbank.jpg')}
                  />
                  <TouchableOpacity
                    onPress={() => alert('Henüz Aktif Değil')}
                    style={styles.listButtonContainer}
                  >
                    <Text style={styles.listButtonText}>    Halkbank    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.listItem}>
                  <Image
                    style={{ width: 34, height: 34, borderWidth: 0, borderColor: 'white', marginRight: 3 }}
                    resizeMethod='resize'
                    source={require('./images/zikatilim.jpg')}
                  />
                  <TouchableOpacity
                    onPress={() => alert('Henüz Aktif Değil')}
                    style={styles.listButtonContainer}
                  >
                    <Text style={styles.listButtonText}>Ziraat Katılım</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.listItem}>
                  <Image
                    style={{ width: 34, height: 34, borderWidth: 0, borderColor: 'white', marginRight: 3 }}
                    resizeMethod='resize'
                    source={require('./images/vakif.katilim.png')}
                  />
                  <TouchableOpacity
                    onPress={() => alert('Henüz Aktif Değil')}
                    style={styles.listButtonContainer}
                  >
                    <Text style={styles.listButtonText}>Vakıf Katılım</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.listItem}>
                  <Image
                    style={{ width: 34, height: 34, borderWidth: 0, borderColor: 'white', marginRight: 3 }}
                    resizeMethod='resize'
                    source={require('./images/emlak.png')}
                  />
                  <TouchableOpacity
                    onPress={() => alert('Henüz Aktif Değil')}
                    style={styles.listButtonContainer}
                  >
                    <Text style={styles.listButtonText}>Emlak Katılım</Text>
                  </TouchableOpacity>
                </View>
                
              </View>
            </>
          )}
          {selectedAccount && xData && (
            <HesapHareketleri
              transactions={filteredTransactions} 
              accountName={selectedAccount.account.name}
              startDate={startDate} 
              endDate={endDate} 
              setStartDate={setStartDate} 
              setEndDate={setEndDate} 
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  home: {
    backgroundColor: 'orange',
    flex: 1,
  },
  toolbar: {
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'lightgrey',
    width: '100%',
    zIndex: 1,
    marginBottom: 20,
  },
  toolbarText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  content: {
    marginTop: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    marginBottom: 8,
  },
  container: {
    marginTop: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 40,
  },
  buttonText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  listButtonContainer: {
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 40,
  },
  listButtonText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
  },
  webviewContainer: {
    flex: 1,
    position: 'relative',
  },
  webview: {
    flex: 1,
  },
  backButton: {
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 40,
  },
  backButtonText: {
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
  },
  tokenText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default App;
