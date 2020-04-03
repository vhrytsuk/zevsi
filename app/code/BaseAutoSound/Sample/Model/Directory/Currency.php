<?php
namespace BaseAutoSound\Sample\Model\Directory;

class Currency extends \Magento\Directory\Model\Currency
{
    /*
    * You can set precision from here in $options array
    */
    public function formatTxt($price, $options = [])
    {
        if (!is_numeric($price)) {
            $price = $this->_localeFormat->getNumber($price);
        }
        $price = sprintf("%F", $price);

        $options['precision'] = 0;

        return $this->_localeCurrency->getCurrency($this->getCode())->toCurrency($price, $options);
    }
}
