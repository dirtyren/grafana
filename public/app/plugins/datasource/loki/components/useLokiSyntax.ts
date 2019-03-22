import { useState, useEffect } from 'react';
import LokiLanguageProvider from 'app/plugins/datasource/loki/language_provider';
import Prism from 'prismjs';
import { useLokiLabels } from 'app/plugins/datasource/loki/components/useLokiLabels';
import { CascaderOption } from 'app/plugins/datasource/loki/components/LokiQueryFieldForm';

const PRISM_SYNTAX = 'promql';

/**
 *
 * @param languageProvider
 * @description Initializes given language provider, exposes Loki syntax and enables loading label option values
 */
export const useLokiSyntax = (languageProvider: LokiLanguageProvider) => {
  // State
  const [languageProviderInitialised, setLanguageProvideInitilised] = useState(false);
  const [syntax, setSyntax] = useState(null);

  /**
   * Holds information about currently selected option from rc-cascader to perform effect
   * that loads option values not fetched yet. Based on that useLokiLabels hook decides whether or not
   * the option requires additional data fetching
   */
  const [activeOption, setActiveOption] = useState<CascaderOption[]>();

  const { logLabelOptions, setLogLabelOptions, refreshLabels } = useLokiLabels(
    languageProvider,
    languageProviderInitialised,
    activeOption
  );

  // Async
  const initialiseLanguageProvider = async () => {
    if (!languageProviderInitialised) {
      await languageProvider.start();
    }
    Prism.languages[PRISM_SYNTAX] = languageProvider.getSyntax();
    setLogLabelOptions(languageProvider.logLabelOptions);
    setSyntax(languageProvider.getSyntax());
    setLanguageProvideInitilised(true);
  };

  // Effects
  useEffect(() => {
    initialiseLanguageProvider();
  }, []);

  return {
    isSyntaxReady: languageProviderInitialised,
    syntax,
    logLabelOptions,
    setActiveOption,
    refreshLabels,
  };
};