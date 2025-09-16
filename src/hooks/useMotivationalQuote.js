import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useContext } from 'react';
import I18nContext from '../context/I18nContext';

const fetchAndTranslateQuote = async (locale) => {
  //Chama a API para a frase em inglês
  const quoteResponse = await axios.get('https://zenquotes.io/api/random');
  const englishQuoteData = quoteResponse.data[0];

  const quote = {
    text: englishQuoteData.q,
    author: englishQuoteData.a,
  };

  //Verifica o idioma e traduzir se não for inglês
  if (locale !== 'en') {
    const translationApiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(quote.text)}&langpair=en|${locale}`;
    
    try {
      const translationResponse = await axios.get(translationApiUrl);
      const translatedText = translationResponse.data.responseData.translatedText;
      
      // Retornar a frase traduzida, mas manter o autor original
      return {
        text: translatedText,
        author: quote.author,
      };
    } catch (error) {
      console.error("Falha na tradução da frase:", error);
      // Em caso de falha, retornar a frase em inglês
      return quote;
    }
  }

  //Se o idioma for inglês, retornar a frase original
  return quote;
};

export const useMotivationalQuote = () => {
  const { locale } = useContext(I18nContext);

  return useQuery({
    queryKey: ['motivationalQuote', locale],
    queryFn: () => fetchAndTranslateQuote(locale),
    staleTime: 1000 * 60 * 60,
  });
};