<?php
namespace Magento\Framework\Locale\Format;

/**
 * Interceptor class for @see \Magento\Framework\Locale\Format
 */
class Interceptor extends \Magento\Framework\Locale\Format implements \Magento\Framework\Interception\InterceptorInterface
{
    use \Magento\Framework\Interception\Interceptor;

    public function __construct(\Magento\Framework\App\ScopeResolverInterface $scopeResolver, \Magento\Framework\Locale\ResolverInterface $localeResolver, \Magento\Directory\Model\CurrencyFactory $currencyFactory)
    {
        $this->___init();
        parent::__construct($scopeResolver, $localeResolver, $currencyFactory);
    }

    /**
     * {@inheritdoc}
     */
    public function getNumber($value)
    {
        $pluginInfo = $this->pluginList->getNext($this->subjectType, 'getNumber');
        if (!$pluginInfo) {
            return parent::getNumber($value);
        } else {
            return $this->___callPlugins('getNumber', func_get_args(), $pluginInfo);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function getPriceFormat($localeCode = null, $currencyCode = null)
    {
        $pluginInfo = $this->pluginList->getNext($this->subjectType, 'getPriceFormat');
        if (!$pluginInfo) {
            return parent::getPriceFormat($localeCode, $currencyCode);
        } else {
            return $this->___callPlugins('getPriceFormat', func_get_args(), $pluginInfo);
        }
    }
}
