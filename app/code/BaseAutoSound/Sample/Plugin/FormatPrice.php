<?php
namespace BaseAutoSound\Sample\Plugin;

class FormatPrice
{
    /*
    * Returns an array with price formatting info
    *
    * \Magento\Framework\Locale\Format $subject
    */
    public function aroundGetPriceFormat(\Magento\Framework\Locale\Format $subject, callable $proceed, $localeCode = null, $currencyCode = null)
    {
        $returnValue = $proceed($localeCode, $currencyCode);

        $returnValue['requiredPrecision'] = 0;

        return $returnValue;
    }
}
